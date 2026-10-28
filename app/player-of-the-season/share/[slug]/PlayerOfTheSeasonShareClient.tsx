'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getClubMatchOutcome,
  getPlayerPositionLabel,
  getSeasonAwards,
  getSeasonSummaryLabel,
} from '../../../../lib/player-of-the-season';
import {
  getPlayerOfTheSeasonShareText,
  type PlayerOfTheSeasonShareRow,
} from '../../../../services/playerOfTheSeasonShareService';

interface Props {
  share: PlayerOfTheSeasonShareRow;
}

function getOrdinal(position: number): string {
  if (position % 100 >= 11 && position % 100 <= 13) return `${position}th`;
  switch (position % 10) {
    case 1: return `${position}st`;
    case 2: return `${position}nd`;
    case 3: return `${position}rd`;
    default: return `${position}th`;
  }
}

export default function PlayerOfTheSeasonShareClient({ share }: Props) {
  const [shareLink, setShareLink] = useState(`https://footle.club/player-of-the-season/share/${share.slug}`);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const { player_build: player, season } = share;
  const shareText = getPlayerOfTheSeasonShareText(player, season);
  const challengeText = `${shareText}\n\nCan you beat my season? Build your player and find out: ${shareLink}`;

  useEffect(() => {
    setShareLink(window.location.href);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        challengeText,
      );
      setCopyStatus('copied');
    } catch (error) {
      console.error('Failed to copy Player of the Season share link:', error);
      setCopyStatus('failed');
    }
    window.setTimeout(() => setCopyStatus('idle'), 2500);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(challengeText)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(challengeText)}`;
  const playerResults = season.results.filter(
    (result) => result.home.id === season.club.id || result.away.id === season.club.id,
  );
  const seasonAwards = getSeasonAwards(season);

  return (
    <main className="mx-auto max-w-6xl space-y-8 py-10">
      <header className="space-y-3 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#03E690]">Shared Premier League season</p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">{getSeasonSummaryLabel(season, player.age)}</h1>
        <p className="text-lg text-gray-300">
          {player.name} · {season.club.name} · {getOrdinal(season.tablePosition)} place
        </p>
      </header>

      <section className="rounded-3xl border border-[#03E690]/30 bg-gradient-to-br from-gray-900 via-gray-900 to-[#03E690]/10 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-400">Season performance</p>
            <h2 className="mt-2 text-3xl font-black text-white">{player.name}</h2>
            <p className="mt-1 text-gray-300">{player.age}-year-old {player.nationality} {getPlayerPositionLabel(player.position)} · {season.club.name}</p>
          </div>
          <p className="rounded-xl bg-gray-950/70 px-4 py-3 text-lg font-bold text-white">{season.averageRating.toFixed(2)} average rating</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Appearances', season.appearances],
            ['Minutes', season.minutes],
            ['Goals', season.goals],
            ['Assists', season.assists],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-400">{label}</p>
              <p className="mt-2 text-2xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>
        {seasonAwards.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Awards won</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {seasonAwards.map((award) => (
                <span key={award} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-sm font-bold text-amber-200">
                  {award}
                </span>
              ))}
            </div>
          </div>
        )}
        {seasonAwards.length === 0 && (
          <p className="mt-5 text-sm text-gray-400">No major award this season—there&apos;s always another campaign to chase.</p>
        )}
        {season.goldenBootTarget !== undefined && (
          <p className="mt-3 text-sm text-gray-400">
            Award targets this season:{' '}
            <span className="font-bold text-amber-200">
              Golden Boot {season.goldenBootTarget} goals
              {season.goldenPlaymakerTarget !== undefined && ` · Golden Playmaker ${season.goldenPlaymakerTarget} assists`}
            </span>
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-xl bg-[#03E690] px-5 py-3 font-bold text-gray-950 transition hover:bg-emerald-300"
          >
            {copyStatus === 'copied' ? 'Link copied' : copyStatus === 'failed' ? 'Copy failed' : 'Copy share link'}
          </button>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-500">
            Share to WhatsApp
          </a>
          <a href={xUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-gray-800 px-5 py-3 font-bold text-white transition hover:bg-gray-700">
            Share to X
          </a>
          <Link href="/player-of-the-season" className="rounded-xl border border-gray-700 px-5 py-3 font-bold text-white transition hover:border-[#03E690] hover:text-[#03E690]">
            Create your own player
          </Link>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-5">
          <h2 className="text-xl font-bold text-white">{season.club.name} results</h2>
          <ol className="mt-4 space-y-2">
            {playerResults.map((result) => (
              <li
                key={`${result.round}-${result.home.id}`}
                className={`grid grid-cols-[5rem_1fr_auto] items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                  {
                    win: 'border-[#03E690]/40 bg-[#03E690]/[0.06]',
                    draw: 'border-orange-400/40 bg-orange-400/[0.06]',
                    loss: 'border-red-400/40 bg-red-400/[0.06]',
                  }[getClubMatchOutcome(result, season.club.id)]
                }`}
              >
                <span className="text-gray-500">GW {result.round}</span>
                <span className="text-gray-200">{result.home.name} <span className="text-gray-500">vs</span> {result.away.name}</span>
                <span className={`font-bold tabular-nums ${
                  {
                    win: 'text-[#03E690]',
                    draw: 'text-orange-300',
                    loss: 'text-red-300',
                  }[getClubMatchOutcome(result, season.club.id)]
                }`}>{result.homeGoals} - {result.awayGoals}</span>
                {result.playerPlayed ? (
                  <span className="col-span-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                    <span>{player.name}: {result.playerMinutes} min</span>
                    {result.playerGoals > 0 && <span className="text-[#03E690]">⚽ {result.playerGoals} goal{result.playerGoals === 1 ? '' : 's'}</span>}
                    {result.playerAssists > 0 && <span className="text-sky-300">🅰 {result.playerAssists} assist{result.playerAssists === 1 ? '' : 's'}</span>}
                    {result.playerRating !== null && <span>rating {result.playerRating.toFixed(1)}</span>}
                  </span>
                ) : (
                  <span className="col-span-3 text-xs text-gray-500">{player.name} wasn&apos;t selected</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-5">
          <h2 className="text-xl font-bold text-white">Final Premier League table</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-2 py-2">#</th>
                  <th className="px-2 py-2">Club</th>
                  <th className="px-2 py-2">P</th>
                  <th className="px-2 py-2">GD</th>
                  <th className="px-2 py-2">Pts</th>
                </tr>
              </thead>
              <tbody>
                {season.table.map((entry, index) => (
                  <tr key={entry.team.id} className={entry.team.id === season.club.id ? 'border-t border-gray-800 bg-[#03E690]/10 text-white' : 'border-t border-gray-800 text-gray-300'}>
                    <td className="px-2 py-2.5">{index + 1}</td>
                    <td className="px-2 py-2.5 font-medium">{entry.team.name}</td>
                    <td className="px-2 py-2.5">{entry.played}</td>
                    <td className="px-2 py-2.5">{entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}</td>
                    <td className="px-2 py-2.5 font-bold">{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
