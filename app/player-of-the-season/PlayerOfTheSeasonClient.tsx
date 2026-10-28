'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ATTRIBUTE_LABELS,
  CLUBS,
  MAX_ATTRIBUTE_POINTS,
  FOOT_OPTIONS,
  NATIONALITY_OPTIONS,
  POSITION_OPTIONS,
  getDefaultAttributes,
  getDefaultBuild,
  getClubMatchOutcome,
  getSeasonAwards,
  getSeasonSummaryLabel,
  simulatePlayerOfTheSeason,
  type AttributeSet,
  type PlayerBuild,
  type PlayerMatchResult,
  type PlayerPosition,
  type PlayerSeasonSummary,
  type PreferredFoot,
} from '../../lib/player-of-the-season';
import { createPlayerOfTheSeasonShare } from '../../services/playerOfTheSeasonShareService';

function sumAttributes(attributes: AttributeSet): number {
  return ATTRIBUTE_LABELS.reduce((sum, key) => sum + attributes[key], 0);
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

function FixtureResult({ result, playerName, clubId }: { result: PlayerMatchResult; playerName: string; clubId: string }) {
  const outcome = getClubMatchOutcome(result, clubId);
  const outcomeClasses = {
    win: 'border-[#03E690]/40 bg-[#03E690]/[0.06]',
    draw: 'border-orange-400/40 bg-orange-400/[0.06]',
    loss: 'border-red-400/40 bg-red-400/[0.06]',
  }[outcome];
  const scoreClasses = {
    win: 'bg-[#03E690]/15 text-[#03E690]',
    draw: 'bg-orange-400/15 text-orange-300',
    loss: 'bg-red-400/15 text-red-300',
  }[outcome];

  return (
    <article className={`season-result-enter rounded-2xl border p-5 sm:p-6 ${outcomeClasses}`}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <p className="text-right text-lg font-bold text-white sm:text-2xl">{result.home.name}</p>
        <p className={`rounded-xl px-4 py-3 text-3xl font-black tabular-nums ${scoreClasses}`}>
          {result.homeGoals} - {result.awayGoals}
        </p>
        <p className="text-lg font-bold text-white sm:text-2xl">{result.away.name}</p>
      </div>
      <div className="mt-5 border-t border-gray-800 pt-4">
        {result.playerPlayed ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-white">{playerName} <span className="ml-2 text-sm font-normal text-gray-400">{result.playerMinutes} minutes · rating {result.playerRating?.toFixed(1)}</span></p>
            <p className="flex flex-wrap gap-3 text-sm font-bold">
              {result.playerGoals > 0 && <span className="text-[#03E690]">⚽ {result.playerGoals} goal{result.playerGoals === 1 ? '' : 's'}</span>}
              {result.playerAssists > 0 && <span className="text-sky-300">🅰 {result.playerAssists} assist{result.playerAssists === 1 ? '' : 's'}</span>}
              {result.playerGoals === 0 && result.playerAssists === 0 && <span className="text-gray-400">No goal contributions</span>}
            </p>
          </div>
        ) : (
          <p className="text-gray-300"><span className="font-semibold text-white">{playerName}</span> wasn&apos;t selected for this match.</p>
        )}
      </div>
    </article>
  );
}

export default function PlayerOfTheSeasonClient() {
  const router = useRouter();
  const [build, setBuild] = useState<PlayerBuild>(() => getDefaultBuild());
  const [season, setSeason] = useState<PlayerSeasonSummary | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [isSavingShare, setIsSavingShare] = useState(false);
  const matchFeedRef = useRef<HTMLElement>(null);

  const totalAttributes = useMemo(() => sumAttributes(build.attributes), [build.attributes]);
  const remainingPoints = MAX_ATTRIBUTE_POINTS - totalAttributes;

  const updateBuild = (changes: Partial<PlayerBuild>) => {
    setBuild((current) => ({ ...current, ...changes }));
  };

  const updatePosition = (position: PlayerPosition) => {
    setBuild((current) => ({
      ...current,
      position,
      attributes: getDefaultAttributes(position),
    }));
  };

  const updateAttribute = (key: keyof AttributeSet, value: number) => {
    setBuild((current) => {
      const oldValue = current.attributes[key];
      const currentTotal = sumAttributes(current.attributes);
      const maximumAllowed = MAX_ATTRIBUTE_POINTS - (currentTotal - oldValue);
      const adjustedValue = Math.min(Math.max(1, value), 100, maximumAllowed);

      return {
        ...current,
        attributes: {
          ...current.attributes,
          [key]: adjustedValue,
        },
      };
    });
  };

  const startSeason = () => {
    const playerBuild = { ...build, name: build.name.trim() || 'Player' };
    setBuild(playerBuild);
    setSeason(simulatePlayerOfTheSeason(playerBuild, Date.now() + Math.floor(Math.random() * 1_000_000_000)));
    setRoundIndex(0);
    setIsPaused(false);
    setShareMessage('');
  };

  const restartSeason = () => {
    setSeason(null);
    setRoundIndex(0);
    setIsPaused(false);
    setShareMessage('');
  };

  useEffect(() => {
    if (!season || isPaused || roundIndex >= 38) return;

    const timer = window.setTimeout(() => setRoundIndex((current) => current + 1), 700);
    return () => window.clearTimeout(timer);
  }, [season, isPaused, roundIndex]);

  useEffect(() => {
    if (!season) return;

    const frame = window.requestAnimationFrame(() => {
      matchFeedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [season]);

  const handleShare = async () => {
    if (!season) return;
    setIsSavingShare(true);
    setShareMessage('');
    try {
      const share = await createPlayerOfTheSeasonShare(build, season);
      router.push(`/player-of-the-season/share/${share.slug}`);
    } catch (error) {
      console.error('Failed to save Player of the Season share:', error);
      setShareMessage('Unable to save your result right now. Please try again.');
      setIsSavingShare(false);
    }
  };

  const cumulativeResults = season
    ? season.results.filter((result) => result.round <= roundIndex + 1 && (result.home.id === season.club.id || result.away.id === season.club.id))
    : [];
  const clubResults = season
    ? season.results.filter((result) => result.home.id === season.club.id || result.away.id === season.club.id)
    : [];
  const cumulativeAppearances = cumulativeResults.filter((result) => result.playerPlayed).length;
  const cumulativeGoals = cumulativeResults.reduce((total, result) => total + result.playerGoals, 0);
  const isSeasonComplete = Boolean(season && roundIndex >= 38);

  return (
    <main className="space-y-10 pb-12">
      <header className="space-y-4">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#03E690]">Player of the Season</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          {isSeasonComplete ? 'Your season is complete' : season ? 'Matchday by matchday' : 'Build a star and simulate the Premier League'}
        </h1>
        <p className="max-w-3xl text-lg text-gray-300">
          {isSeasonComplete
            ? `The final whistle has gone for ${build.name}. Here is the full story of their Premier League season.`
            : season
              ? `Matchdays are unfolding automatically. Follow all the results and see how ${build.name} fares for ${season.club.name}.`
              : 'Design your footballer, choose a club, then start the season to follow every match and discover the final outcome.'}
        </p>
      </header>

      {!season && (
        <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">Create your player</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Player build</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-300">
              <span>Player name</span>
              <input
                value={build.name}
                onChange={(event) => updateBuild({ name: event.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-[#03E690]"
              />
            </label>

            <label className="space-y-2 text-sm text-gray-300">
              <span>Nationality</span>
              <select
                value={build.nationality}
                onChange={(event) => updateBuild({ nationality: event.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-[#03E690]"
              >
                {NATIONALITY_OPTIONS.map((nationality) => (
                  <option key={nationality} value={nationality}>{nationality}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-gray-300">
              <span>Age</span>
              <input
                type="number"
                min={16}
                max={40}
                value={build.age}
                onChange={(event) => updateBuild({ age: Math.min(40, Math.max(16, Number(event.target.value) || 16)) })}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-[#03E690]"
              />
            </label>

            <label className="space-y-2 text-sm text-gray-300">
              <span>Preferred foot</span>
              <select
                value={build.preferredFoot}
                onChange={(event) => updateBuild({ preferredFoot: event.target.value as PreferredFoot })}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-[#03E690]"
              >
                {FOOT_OPTIONS.map((foot) => <option key={foot} value={foot}>{foot}</option>)}
              </select>
            </label>

            <label className="space-y-2 text-sm text-gray-300">
              <span>Height (cm)</span>
              <input
                type="number"
                min={150}
                max={205}
                value={build.height}
                onChange={(event) => updateBuild({ height: Math.min(205, Math.max(150, Number(event.target.value) || 180)) })}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-[#03E690]"
              />
            </label>

            <label className="space-y-2 text-sm text-gray-300">
              <span>Weight (kg)</span>
              <input
                type="number"
                min={50}
                max={110}
                value={build.weight}
                onChange={(event) => updateBuild({ weight: Math.min(110, Math.max(50, Number(event.target.value) || 70)) })}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-[#03E690]"
              />
            </label>

            <label className="space-y-2 text-sm text-gray-300 md:col-span-2">
              <span>Position</span>
              <select
                value={build.position}
                onChange={(event) => updatePosition(event.target.value as PlayerPosition)}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-[#03E690]"
              >
                {POSITION_OPTIONS.map((position) => <option key={position.value} value={position.value}>{position.label}</option>)}
              </select>
            </label>

            <label className="space-y-2 text-sm text-gray-300 md:col-span-2">
              <span>Club</span>
              <select
                value={build.clubId}
                onChange={(event) => updateBuild({ clubId: event.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-[#03E690]"
              >
                {CLUBS.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">Attribute points</p>
                <h3 className="mt-2 text-xl font-bold text-white">Distribution</h3>
              </div>
              <div className="rounded-xl border border-[#03E690]/40 bg-[#03E690]/10 px-3 py-2 text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-[#03E690]">Points used</p>
                <p className="text-lg font-bold text-white">{totalAttributes}/{MAX_ATTRIBUTE_POINTS}</p>
              </div>
            </div>
            <div className="space-y-4">
              {ATTRIBUTE_LABELS.map((key) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span className="capitalize">{key}</span>
                    <span className="font-semibold text-white">{build.attributes[key]}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={build.attributes[key]}
                    onChange={(event) => updateAttribute(key, Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-800 accent-[#03E690]"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-3 text-sm text-gray-300">
              <span>Points remaining (you don&apos;t have to spend them all)</span>
              <span className="font-bold text-[#03E690]">{remainingPoints}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={startSeason}
            disabled={totalAttributes > MAX_ATTRIBUTE_POINTS}
            className="mt-6 w-full rounded-xl bg-[#03E690] px-5 py-4 text-lg font-black text-gray-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Simulate the season
          </button>
        </section>
      )}

      {season && !isSeasonComplete && (
        <section ref={matchFeedRef} className="mx-auto max-w-5xl space-y-6 scroll-mt-4">
          <div className="sticky top-2 z-10 rounded-2xl border border-gray-800 bg-gray-950/95 p-4 shadow-xl backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">Premier League season</p>
                <p className="mt-1 font-bold text-white">
                  Matchday {roundIndex + 1} <span className="text-gray-500">/ 38</span>
                  <span className="ml-3 text-sm font-normal text-gray-400">
                    {cumulativeAppearances} appearances · {cumulativeGoals} goals so far
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaused((paused) => !paused)}
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-white hover:border-[#03E690] hover:text-[#03E690]"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(false);
                    setRoundIndex(38);
                  }}
                  className="rounded-lg bg-[#03E690] px-3 py-2 text-sm font-bold text-gray-950 hover:bg-emerald-300"
                >
                  Skip to summary
                </button>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-800" aria-label={`${roundIndex + 1} of 38 matchdays`}>
              <div className="h-full rounded-full bg-[#03E690] transition-all duration-500" style={{ width: `${((roundIndex + 1) / 38) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-5">
            {Array.from({ length: roundIndex + 1 }, (_, index) => {
              const round = roundIndex + 1 - index;
              const result = clubResults[round - 1];
              return (
                <section
                  key={round}
                  className="rounded-3xl border border-gray-800 bg-gray-900/70 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-black text-white">Matchday {round}</h2>
                    <span className="text-xs uppercase tracking-wider text-gray-500">Premier League</span>
                  </div>
                  {result && <FixtureResult result={result} playerName={build.name} clubId={season.club.id} />}
                </section>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-500" role="status">
            {isPaused ? 'Season paused' : 'Results are playing automatically'}
          </p>
        </section>
      )}

      {season && isSeasonComplete && (
        <section className="space-y-8">
          <div className="rounded-3xl border border-[#03E690]/30 bg-gradient-to-br from-gray-900 via-gray-900 to-[#03E690]/10 p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">Final season summary</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white">{getSeasonSummaryLabel(season)}</h2>
                <p className="mt-2 text-gray-300">{build.name} · {season.club.name} · {getOrdinal(season.tablePosition)} in the Premier League</p>
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
            {getSeasonAwards(season).length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Awards won</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {getSeasonAwards(season).map((award) => (
                    <span key={award} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-sm font-bold text-amber-200">
                      {award}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {getSeasonAwards(season).length === 0 && (
              <p className="mt-5 text-sm text-gray-400">No major award this season—but there&apos;s always another campaign to chase.</p>
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
                onClick={handleShare}
                disabled={isSavingShare}
                className="rounded-xl bg-[#03E690] px-5 py-3 font-bold text-gray-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
              >
                {isSavingShare ? 'Saving result…' : 'Share result'}
              </button>
              <button type="button" onClick={restartSeason} className="rounded-xl border border-gray-700 px-5 py-3 font-bold text-white transition hover:border-[#03E690] hover:text-[#03E690]">
                Build another player
              </button>
              <Link href="/games" className="rounded-xl border border-gray-700 px-5 py-3 font-bold text-white transition hover:border-[#03E690] hover:text-[#03E690]">
                Browse games
              </Link>
            </div>
            {shareMessage && <p className="mt-3 text-sm text-red-300" role="alert">{shareMessage}</p>}
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-5">
              <h2 className="text-xl font-bold text-white">All {season.club.name} results</h2>
              <ol className="mt-4 space-y-2">
                {season.results
                  .filter((result) => result.home.id === season.club.id || result.away.id === season.club.id)
                  .map((result) => {
                    const outcome = getClubMatchOutcome(result, season.club.id);
                    const resultClasses = {
                      win: 'border-[#03E690]/40 bg-[#03E690]/[0.06]',
                      draw: 'border-orange-400/40 bg-orange-400/[0.06]',
                      loss: 'border-red-400/40 bg-red-400/[0.06]',
                    }[outcome];
                    const scoreClasses = {
                      win: 'text-[#03E690]',
                      draw: 'text-orange-300',
                      loss: 'text-red-300',
                    }[outcome];

                    return (
                      <li key={`${result.round}-${result.home.id}`} className={`grid grid-cols-[5rem_1fr_auto] items-center gap-3 rounded-xl border px-3 py-3 text-sm ${resultClasses}`}>
                        <span className="text-gray-500">GW {result.round}</span>
                        <span className="text-gray-200">{result.home.name} <span className="text-gray-500">vs</span> {result.away.name}</span>
                        <span className={`font-bold tabular-nums ${scoreClasses}`}>{result.homeGoals} - {result.awayGoals}</span>
                        {result.playerPlayed && (
                          <span className="col-span-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                            <span>{build.name}: {result.playerMinutes} min</span>
                            {result.playerGoals > 0 && <span className="text-[#03E690]">⚽ {result.playerGoals} goal{result.playerGoals === 1 ? '' : 's'}</span>}
                            {result.playerAssists > 0 && <span className="text-sky-300">🅰 {result.playerAssists} assist{result.playerAssists === 1 ? '' : 's'}</span>}
                            {result.playerRating !== null && <span>{result.playerRating.toFixed(1)} rating</span>}
                          </span>
                        )}
                      </li>
                    );
                  })}
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
        </section>
      )}
    </main>
  );
}
