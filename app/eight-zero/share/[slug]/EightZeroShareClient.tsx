'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getWorldCupShareBySlug, EightZeroShareRow } from '../../../../services/eightZeroShareService';
import { getEightZeroDisplaySummary, getEightZeroOutcomeTitle } from '../../../../lib/eight-zero-share-format';

interface Props {
  slug: string;
}

export default function EightZeroShareClient({ slug }: Props) {
  const [share, setShare] = useState<EightZeroShareRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [browserShareLink, setBrowserShareLink] = useState('');

  useEffect(() => {
    const loadShare = async () => {
      setLoading(true);
      setError('');

      try {
        const shareData = await getWorldCupShareBySlug(slug);
        if (!shareData) {
          setError('This share page could not be found.');
          return;
        }

        setShare(shareData);
      } catch (err) {
        console.error(err);
        setError('Unable to load shared World Cup results right now.');
      } finally {
        setLoading(false);
      }
    };

    loadShare();
  }, [slug]);

  useEffect(() => {
    setBrowserShareLink(window.location.href);
  }, [slug]);

  const shareLink = browserShareLink || `https://footle.club/eight-zero/share/${slug}`;

  const writeClipboardText = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Clipboard API failed, trying fallback:', err);
      }
    }

    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.padding = '0';
    textarea.style.border = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    try {
      return document.execCommand('copy');
    } catch (err) {
      console.error('Clipboard fallback failed:', err);
      return false;
    } finally {
      document.body.removeChild(textarea);
      activeElement?.focus();
    }
  };

  const copyLink = async () => {
    const copyText = share ? `${getEightZeroDisplaySummary(share)}\n\nCan you build better on 8-0?: ${shareLink}` : shareLink;
    const copied = await writeClipboardText(copyText);
    setCopyStatus(copied ? 'copied' : 'failed');
    setTimeout(() => setCopyStatus('idle'), 2500);
  };

  const whatsappText = share
    ? `${share.share_text}

Check it out: ${shareLink}`
    : `Check out this 8-0 World Cup challenge: ${shareLink}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  const bestPlayer = useMemo(() => {
    if (!share) return null;
    return share.result.playerStats.reduce((winner, player) => {
      if (!winner) return player;
      if (player.goals !== winner.goals) return player.goals > winner.goals ? player : winner;
      if (player.rating !== winner.rating) return player.rating > winner.rating ? player : winner;
      return winner;
    }, share.result.playerStats[0]);
  }, [share]);

  const outcomeTitle = share ? getEightZeroOutcomeTitle(share) : '';
  const displaySummary = share ? getEightZeroDisplaySummary(share) : '';

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading shared World Cup...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-12">{error}</div>;
  }

  if (!share) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-10 px-4 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">Shared World Cup run</p>
        <h1 className="text-4xl font-bold text-white">{outcomeTitle}</h1>
        <p className="mx-auto max-w-3xl text-gray-300">Review the full team, performance, and stats behind this shared tournament run.</p>
      </header>

      <section className="rounded-3xl border border-gray-700 bg-gray-900/80 p-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Summary</p>
            <h2 className="text-2xl font-bold text-white">{outcomeTitle}</h2>
            <p className="text-lg text-gray-200">{displaySummary}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-800 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Team overall</div>
                <div className="mt-2 text-3xl font-bold text-white">{share.team_overall}</div>
              </div>
              <div className="rounded-2xl bg-gray-800 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Record</div>
                <div className="mt-2 text-3xl font-bold text-white">
                  {share.record.wins}-{share.record.draws}-{share.record.losses}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-700 bg-gray-800 p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-gray-400">Best player</div>
            <div className="mt-3 text-2xl font-bold text-white">{bestPlayer?.name ?? 'N/A'}</div>
            <div className="mt-2 text-sm text-gray-400">{bestPlayer?.slot ?? ''} • {bestPlayer?.rating ?? 0} overall</div>
            <div className="mt-3 text-sm text-gray-300">Goals: {bestPlayer?.goals ?? 0}</div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-700 pt-5">
          <p className="text-sm uppercase tracking-[0.18em] text-gray-400">Share this result</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            >
              {copyStatus === 'copied' ? 'Link copied' : copyStatus === 'failed' ? 'Copy failed' : 'Copy link'}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600"
            >
              Share to WhatsApp
            </a>
            <Link href="/eight-zero" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200">
              Play again
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-700 bg-gray-900/80 p-5">
          <h2 className="text-lg font-bold text-white">Final XI</h2>
          <div className="mt-4 space-y-3">
            {share.picks.map((pick) => (
              <div key={`${pick.slotId}-${pick.player.name}`} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3">
                <div>
                  <div className="font-semibold text-white">{pick.player.name}</div>
                  <div className="text-sm text-gray-400">{pick.slotLabel} • {pick.player.position}</div>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-200">{pick.player.maxRating}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-700 bg-gray-900/80 p-5">
          <h2 className="text-lg font-bold text-white">Tournament path</h2>
          <div className="mt-4 space-y-3">
            {share.result.matches.map((match, index) => (
              <div key={`${match.stage}-${match.opponent}-${index}`} className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{match.stage} vs {match.opponent}</div>
                  </div>
                  <div className={`text-lg font-bold ${match.outcome === 'W' ? 'text-emerald-300' : match.outcome === 'D' ? 'text-amber-300' : 'text-red-300'}`}>
                    {match.goalsFor}-{match.goalsAgainst}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                  {match.userScorers.length > 0 && <span>Scorers: {match.userScorers.join(', ')}</span>}
                  {match.userAssists.length > 0 && <span>Assists: {match.userAssists.join(', ')}</span>}
                  {match.cleanSheet && <span>Clean sheet</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-700 bg-gray-900/80 p-5">
        <h2 className="text-lg font-bold text-white">Player stats</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-700">
          <div className="grid grid-cols-[1.5fr_3rem_3rem_3rem] bg-gray-900 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            <span>Player</span>
            <span className="text-center">G</span>
            <span className="text-center">A</span>
            <span className="text-center">CS</span>
          </div>
          {share.result.playerStats.map((player) => (
            <div key={player.name} className="grid grid-cols-[1.5fr_3rem_3rem_3rem] border-t border-gray-800 px-4 py-3 text-sm text-gray-200">
              <div>
                <div className="font-semibold text-white">{player.name}</div>
                <div className="text-xs text-gray-400">{player.slot} • {player.rating}</div>
              </div>
              <div className="text-center">{player.goals}</div>
              <div className="text-center">{player.assists}</div>
              <div className="text-center">{player.cleanSheets}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
