'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  calculateTeamOverall,
  createDraftDraw,
  DraftDraw,
  DraftPick,
  DraftPlayer,
  EIGHT_ZERO_DECADES,
  EIGHT_ZERO_FORMATIONS,
  EightZeroCountryMode,
  EightZeroPosition,
  FormationDefinition,
  FormationSlot,
  getCountriesForDecades,
  getFlatFormationSlots,
  getFormationById,
  getOpenSlotsForPosition,
  isTeamComplete,
  simulateTournament,
  prepareTournament,
  simulateMatch,
  SimulatedMatch,
  buildTournamentResult,
  TournamentResult,
} from '../../lib/eight-zero';
import { createWorldCupShare } from '../../services/eightZeroShareService';

const positionLabels: Record<EightZeroPosition, string> = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
};

type LiveSimulatedMatch = SimulatedMatch & {
  displayStatus: 'live' | 'final';
  displayMinute: number;
  displayEvent: string;
  displayEvents: string[];
};

type GoalEvent = {
  team: 'user' | 'opponent';
  minute: number;
  scorer?: string;
  assist?: string;
};

const MATCH_INTRO_MS = 950;
const GOAL_REVEAL_MS = 1150;
const MATCH_WRAP_MS = 1500;

function formatDecade(decade: number) {
  return `${decade}s`;
}

function getShortName(name: string) {
  const parts = name.split(' ');
  if (parts.length <= 1) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

function getMatchLabel(match: TournamentResult['matches'][number]) {
  const score = `${match.goalsFor}-${match.goalsAgainst}`;
  if (match.penaltyOutcome) {
    return `${score} (${match.penaltyOutcome === 'W' ? 'won' : 'lost'} pens)`;
  }

  return score;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildGoalEvents(match: SimulatedMatch): GoalEvent[] {
  const totalGoals = match.goalsFor + match.goalsAgainst;
  if (!totalGoals) return [];

  const teamOrder: GoalEvent['team'][] = [
    ...Array.from({ length: match.goalsFor }, () => 'user' as const),
    ...Array.from({ length: match.goalsAgainst }, () => 'opponent' as const),
  ].sort(() => Math.random() - 0.5);

  const minutes = teamOrder
    .map((_, index) => {
      const spacing = 78 / Math.max(totalGoals, 1);
      return Math.min(90, Math.max(3, Math.round(8 + spacing * index + Math.random() * Math.max(spacing, 8))));
    })
    .sort((a, b) => a - b);

  let userGoalIndex = 0;

  return teamOrder.map((team, index) => {
    if (team === 'opponent') {
      return { team, minute: minutes[index] };
    }

    const scorer = match.userScorers[userGoalIndex];
    const assist = match.userAssists[userGoalIndex];
    userGoalIndex += 1;
    return { team, minute: minutes[index], scorer, assist };
  });
}

function describeGoalEvent(event: GoalEvent, opponent: string) {
  if (event.team === 'opponent') {
    return `${opponent} score`;
  }

  return event.assist
    ? `${event.scorer ?? 'Your XI'} scores, assisted by ${event.assist}`
    : `${event.scorer ?? 'Your XI'} scores`;
}

function getMatchTone(match: Pick<SimulatedMatch, 'outcome'>) {
  if (match.outcome === 'W') return 'text-emerald-300';
  if (match.outcome === 'D') return 'text-amber-300';
  return 'text-red-300';
}

function getMatchBorderTone(match: LiveSimulatedMatch) {
  if (match.displayStatus === 'live') return 'border-cyan-400/60 bg-cyan-400/10';
  if (match.outcome === 'W') return 'border-emerald-400/40 bg-emerald-400/10';
  if (match.outcome === 'D') return 'border-amber-400/40 bg-amber-400/10';
  return 'border-red-400/40 bg-red-400/10';
}

function EraRangeSlider({
  decadeStart,
  decadeEnd,
  countryCount,
  onChange,
}: {
  decadeStart: number;
  decadeEnd: number;
  countryCount: number;
  onChange: (start: number, end: number) => void;
}) {
  const [activeHandle, setActiveHandle] = useState<'start' | 'end'>('end');
  const min = EIGHT_ZERO_DECADES[0];
  const max = EIGHT_ZERO_DECADES[EIGHT_ZERO_DECADES.length - 1];
  const label = activeHandle === 'start' ? 'From' : 'To';

  return (
    <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-900/70 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-white">Era range</h2>
          <p className="text-sm text-gray-400">{formatDecade(decadeStart)} to {formatDecade(decadeEnd)}</p>
        </div>
        <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
          {countryCount} countries
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveHandle('start')}
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            activeHandle === 'start' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          From
        </button>
        <button
          type="button"
          onClick={() => setActiveHandle('end')}
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            activeHandle === 'end' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          To
        </button>
      </div>

      <div>
        <label className="sr-only" htmlFor="era-slider">{label} decade</label>
        <input
          id="era-slider"
          type="range"
          min={min}
          max={max}
          step={10}
          value={activeHandle === 'start' ? decadeStart : decadeEnd}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (activeHandle === 'start') {
              onChange(Math.min(value, decadeEnd), decadeEnd);
            } else {
              onChange(decadeStart, Math.max(value, decadeStart));
            }
          }}
          className="w-full accent-cyan-400"
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>{formatDecade(decadeStart)}</span>
        <span>{formatDecade(decadeEnd)}</span>
      </div>
    </div>
  );
}

export function PitchLineup({
  formation,
  picks,
  compact = false,
  showRatings = true,
}: {
  formation: FormationDefinition;
  picks: DraftPick[];
  compact?: boolean;
  showRatings?: boolean;
}) {
  const pickBySlot = new Map(picks.map((pick) => [pick.slotId, pick]));

  const renderSlot = (slot: FormationSlot) => {
    const pick = pickBySlot.get(slot.id);

    return (
      <div
        key={slot.id}
        className={`mx-auto flex h-[4.7rem] w-[4.2rem] flex-col items-center justify-center rounded-xl border p-1.5 text-center shadow-lg shadow-black/20 sm:h-24 sm:w-20 ${
          pick
            ? 'border-cyan-300/40 bg-black/45'
            : 'border-dashed border-white/15 bg-white/5'
        }`}
      >
        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-100/80">
          {slot.label}
        </div>
        {pick ? (
          <>
            <div className="mt-1 min-h-[1.7rem] text-[10px] font-semibold leading-tight text-white sm:text-xs">
              {getShortName(pick.player.name)}
            </div>
            {showRatings && (
              <div className="mt-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                {pick.player.maxRating}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-400">
              +
            </div>
            <div className="mt-1 text-[9px] text-gray-400">{slot.position}</div>
          </>
        )}
      </div>
    );
  };

  const rows = formation.rows;

  const positionAvg = (pos: 'DF' | 'MF' | 'FW') => {
    const vals = picks.filter((p) => p.player.position === (pos === 'DF' ? 'DF' : pos === 'MF' ? 'MF' : 'FW')).map((p) => p.player.maxRating || 0);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  return (
    <div className={`relative overflow-hidden rounded-[1.5rem] border border-emerald-500/20 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.18),transparent_38%),linear-gradient(180deg,rgba(7,89,55,0.92),rgba(3,7,18,0.98))] p-4 shadow-2xl shadow-emerald-950/30 ${compact ? 'max-w-sm' : 'max-w-md'} text-white`}>
      <div className="absolute inset-2 rounded-[1.2rem] border border-white/10" />
      <div className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-white/10" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute inset-x-[16%] top-3 h-9 rounded-b-[1rem] border-x border-b border-white/10" />
      <div className="absolute inset-x-[16%] bottom-3 h-9 rounded-t-[1rem] border-x border-t border-white/10" />

      <div className="relative space-y-3 py-3">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-center gap-3">
            {row.map((slot) => renderSlot(slot))}
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between text-sm text-gray-100">
        <div>DEF: {positionAvg('DF') ?? '-'}</div>
        <div>MID: {positionAvg('MF') ?? '-'}</div>
        <div>ATT: {positionAvg('FW') ?? '-'}</div>
      </div>
    </div>
  );
}

export default function EightZeroClient() {
  const [countryMode] = useState<EightZeroCountryMode>('all');
  const [decadeStart, setDecadeStart] = useState(EIGHT_ZERO_DECADES[0]);
  const [decadeEnd, setDecadeEnd] = useState(EIGHT_ZERO_DECADES[EIGHT_ZERO_DECADES.length - 1]);
  const [formationId, setFormationId] = useState(EIGHT_ZERO_FORMATIONS[0].id);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('England');
  const [rollingCountry, setRollingCountry] = useState('England');
  const [rollingYear, setRollingYear] = useState(EIGHT_ZERO_DECADES[0]);
  const [phase, setPhase] = useState<'setup' | 'rolling' | 'announce' | 'draft' | 'ready' | 'complete'>('setup');
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [currentDraw, setCurrentDraw] = useState<DraftDraw | null>(null);
  const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(null);
  const [result, setResult] = useState<TournamentResult | null>(null);
  const [shareSaving, setShareSaving] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const slotSelectRef = useRef<HTMLDivElement | null>(null);
  const simulatorRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const formation = useMemo(() => getFormationById(formationId), [formationId]);
  const slots = useMemo(() => getFlatFormationSlots(formation), [formation]);
  const eligibleCountries = useMemo(() => getCountriesForDecades(decadeStart, decadeEnd), [decadeStart, decadeEnd]);
  const pickedNames = useMemo(() => new Set(picks.map((p) => p.player.name)), [picks]);
  const teamOverall = calculateTeamOverall(picks);

  useEffect(() => {
    if (!eligibleCountries.includes(selectedCountry)) {
      setSelectedCountry(eligibleCountries[0] ?? 'England');
    }
  }, [eligibleCountries, selectedCountry]);

  const buildDraw = (nextPicks: DraftPick[]) => createDraftDraw({
    countryMode,
    selectedCountry,
    decadeStart,
    decadeEnd,
    picks: nextPicks,
    formation,
  });

  const handleStart = () => {
    console.log('[EightZero] handleStart called');
    const nextPicks: DraftPick[] = [];
    setPicks(nextPicks);
    setResult(null);
    setSelectedPlayerName(null);
    setCurrentDraw(null);
    setRollingCountry(selectedCountry);
    setRollingYear(decadeStart);
    setPhase('rolling');
  };

  const handleContinue = () => {
    console.log('[EightZero] handleContinue called');
    setSelectedPlayerName(null);
    setCurrentDraw(null);
    setRollingCountry(selectedCountry);
    setRollingYear(decadeStart);
    setPhase('rolling');
  };

  useEffect(() => {
    if (phase !== 'rolling') return;

    const spinInterval = 120;
    const spinDuration = 2600;
    let elapsed = 0;

    const rollout = window.setInterval(() => {
      elapsed += spinInterval;
      const randomCountry = eligibleCountries[Math.floor(Math.random() * eligibleCountries.length)] ?? selectedCountry;
      const randomYear = EIGHT_ZERO_DECADES[Math.floor(Math.random() * EIGHT_ZERO_DECADES.length)];
      setRollingCountry(randomCountry);
      setRollingYear(randomYear);

      if (elapsed >= spinDuration) {
        window.clearInterval(rollout);
        setCurrentDraw(buildDraw(picks));
        setPhase('announce');
      }
    }, spinInterval);

    return () => window.clearInterval(rollout);
  }, [phase, eligibleCountries, selectedCountry, decadeStart, decadeEnd, countryMode, formation, picks]);

  useEffect(() => {
    if (phase !== 'announce') return;

    const timeout = window.setTimeout(() => setPhase('draft'), 1200);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (!selectedPlayerName || !slotSelectRef.current) return;
    slotSelectRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedPlayerName]);

  const handleReset = () => {
    setPhase('setup');
    setPicks([]);
    setCurrentDraw(null);
    setSelectedPlayerName(null);
    setResult(null);
  };

  const getBestPlayer = () => {
    if (!result) return null;
    return result.playerStats.reduce((best, player) => {
      if (!best) return player;
      if (player.goals !== best.goals) return player.goals > best.goals ? player : best;
      if (player.rating !== best.rating) return player.rating > best.rating ? player : best;
      return best;
    }, result.playerStats[0]);
  };

  const handlePick = (player: DraftPlayer, slot: FormationSlot) => {
    if (!currentDraw || pickedNames.has(player.name)) return;

    const openSlots = getOpenSlotsForPosition(picks, formation, player.position);
    if (!openSlots.some((openSlot) => openSlot.id === slot.id)) return;

    const nextPicks = [
      ...picks,
      {
        slotId: slot.id,
        slotLabel: slot.label,
        player,
        country: currentDraw.country,
        year: currentDraw.year,
      },
    ];

    setPicks(nextPicks);
    setSelectedPlayerName(null);

    if (isTeamComplete(nextPicks, formation)) {
      setPhase('complete');
      setCurrentDraw(null);
      return;
    }

    setCurrentDraw(null);
    setPhase('ready');
  };

  const generateShareText = () => {
    if (!result) return '';

    const bestPlayer = getBestPlayer();
    const record = `${result.record.wins}-${result.record.draws}-${result.record.losses}`;
    const outcomeText = result.wonWorldCup
      ? 'won the World Cup'
      : result.medal
      ? `earned a ${result.medal.toLowerCase()} medal`
      : result.eliminatedAt
      ? `was knocked out at ${result.eliminatedAt}`
      : `finished ${result.finish}`;
    const bestPlayerText = bestPlayer ? ` ${bestPlayer.name} scored ${bestPlayer.goals} ⚽.` : '';

    return `My ${result.teamOverall}-rated World Cup XI ${outcomeText} with a ${record} record.${bestPlayerText} Can you build better on 8-0?\n\nPlay: https://footle.club/eight-zero`;
  };

  const handleShareYourWorldCup = async () => {
    if (!result) return;
    setShareSaving(true);
    setShareError(null);

    try {
      const bestPlayer = getBestPlayer();
      const shareData = await createWorldCupShare({
        result,
        picks,
        teamOverall,
        shareText: generateShareText(),
        topScorer: bestPlayer?.name ?? null,
        topScorerGoals: bestPlayer?.goals ?? 0,
      });

      router.push(`/eight-zero/share/${shareData.slug}`);
    } catch (error) {
      console.error(error);
      setShareError('Unable to save your World Cup share right now. Please try again.');
    } finally {
      setShareSaving(false);
    }
  };

  const selectedPlayer = currentDraw?.players.find((player) => player.name === selectedPlayerName) ?? null;
  const selectedPlayerSlots = selectedPlayer ? getOpenSlotsForPosition(picks, formation, selectedPlayer.position) : [];
  const selectablePlayers = currentDraw?.players.filter((player) => {
    return !pickedNames.has(player.name) && getOpenSlotsForPosition(picks, formation, player.position).length > 0;
  }) ?? [];
  const lastPick = picks.length ? picks[picks.length - 1] : null;

  const [simMatches, setSimMatches] = useState<LiveSimulatedMatch[]>([]);
  const [simRunning, setSimRunning] = useState(false);

  const tournamentRecord = useMemo(() => {
    return simMatches.filter((match) => match.displayStatus === 'final').reduce(
      (acc, match) => {
        if (match.outcome === 'W') acc.wins += 1;
        if (match.outcome === 'D') acc.draws += 1;
        if (match.outcome === 'L') acc.losses += 1;
        return acc;
      },
      { wins: 0, draws: 0, losses: 0 }
    );
  }, [simMatches]);

  const currentMatch = simMatches[simMatches.length - 1] ?? null;

  const revealMatch = async (match: SimulatedMatch, completedMatches: LiveSimulatedMatch[]) => {
    let goalsFor = 0;
    let goalsAgainst = 0;
    const visibleScorers: string[] = [];
    const visibleAssists: string[] = [];
    const displayEvents: string[] = ['Kick-off'];

    const publish = (displayMatch: LiveSimulatedMatch) => {
      setSimMatches([...completedMatches, displayMatch]);
    };

    publish({
      ...match,
      goalsFor,
      goalsAgainst,
      userScorers: [],
      userAssists: [],
      cleanSheet: false,
      displayStatus: 'live',
      displayMinute: 0,
      displayEvent: 'Kick-off',
      displayEvents: [...displayEvents],
    });
    await sleep(MATCH_INTRO_MS);

    const goalEvents = buildGoalEvents(match);

    for (const event of goalEvents) {
      if (event.team === 'user') {
        goalsFor += 1;
        if (event.scorer) visibleScorers.push(event.scorer);
        if (event.assist) visibleAssists.push(event.assist);
      } else {
        goalsAgainst += 1;
      }

      const eventText = `${event.minute}' ${describeGoalEvent(event, match.opponent)}`;
      displayEvents.push(eventText);
      publish({
        ...match,
        goalsFor,
        goalsAgainst,
        userScorers: [...visibleScorers],
        userAssists: [...visibleAssists],
        cleanSheet: false,
        displayStatus: 'live',
        displayMinute: event.minute,
        displayEvent: eventText,
        displayEvents: [...displayEvents],
      });
      // eslint-disable-next-line no-await-in-loop
      await sleep(GOAL_REVEAL_MS);
    }

    if (!goalEvents.length) {
      displayEvents.push("90' No breakthrough");
      publish({
        ...match,
        goalsFor,
        goalsAgainst,
        userScorers: [],
        userAssists: [],
        cleanSheet: match.cleanSheet,
        displayStatus: 'live',
        displayMinute: 90,
        displayEvent: "90' No breakthrough",
        displayEvents: [...displayEvents],
      });
      await sleep(GOAL_REVEAL_MS);
    }

    const finalEvent = match.penaltyOutcome
      ? `Full time: ${getMatchLabel(match)}`
      : `Full time: ${match.outcome === 'W' ? 'win' : match.outcome === 'D' ? 'draw' : 'defeat'}`;
    const finalMatch: LiveSimulatedMatch = {
      ...match,
      displayStatus: 'final',
      displayMinute: 90,
      displayEvent: finalEvent,
      displayEvents: [...displayEvents, finalEvent],
    };

    publish(finalMatch);
    await sleep(MATCH_WRAP_MS);
    return finalMatch;
  };

  function recordGroupMatch(rowA: { country: string; points: number; gd: number; gf: number }, rowB: { country: string; points: number; gd: number; gf: number }, goalsA: number, goalsB: number) {
    rowA.gf += goalsA;
    rowB.gf += goalsB;
    rowA.gd += goalsA - goalsB;
    rowB.gd += goalsB - goalsA;

    if (goalsA > goalsB) {
      rowA.points += 3;
    } else if (goalsB > goalsA) {
      rowB.points += 3;
    } else {
      rowA.points += 1;
      rowB.points += 1;
    }
  }

  function rankGroup(rows: Array<{ country: string; points: number; gd: number; gf: number }>) {
    return [...rows].sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.country.localeCompare(b.country));
  }

  const runTournament = async () => {
    if (simRunning) return;
    setResult(null);
    const matches: SimulatedMatch[] = [];
    const displayMatches: LiveSimulatedMatch[] = [];
    setSimMatches(displayMatches);
    setSimRunning(true);
    window.setTimeout(() => {
      simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);

    if (phase !== 'complete') {
      setPhase('complete');
    }

    const prep = prepareTournament(picks as DraftPick[]);
    const { teamOverall, groupOpponents, remainingOpponents, selectedKnockoutOpponents, stageNames } = prep as any;

    // Group stage
    const rows = [
      { country: 'Your XI', points: 0, gd: 0, gf: 0 },
      ...groupOpponents.map((op: any) => ({ country: op.country, points: 0, gd: 0, gf: 0 })),
    ];
    const rowByCountry = new Map(rows.map((r) => [r.country, r]));

    for (let i = 0; i < groupOpponents.length; i += 1) {
      const opp = groupOpponents[i];
      const match = simulateMatch(`Group Game ${i + 1}`, opp, picks as DraftPick[], false);
      matches.push(match);
      const displayMatch = await revealMatch(match, displayMatches);
      displayMatches.push(displayMatch);
      recordGroupMatch(rowByCountry.get('Your XI')!, rowByCountry.get(opp.country)!, match.goalsFor, match.goalsAgainst);
    }

    const ranked = rankGroup(rows);
    const groupFinish = ranked.findIndex((row) => row.country === 'Your XI') + 1;
    const userRow = rowByCountry.get('Your XI')!;
    const qualified = groupFinish <= 2 || (groupFinish === 3 && (userRow.points >= 4 || (userRow.points === 3 && userRow.gd >= 0)));

    if (!qualified) {
      const final = buildTournamentResult(picks as DraftPick[], teamOverall, matches, groupFinish, 33, null, 'Group stage');
      setResult(final);
      setSimRunning(false);
      return;
    }

    // Knockouts
    for (let index = 0; index < stageNames.length; index += 1) {
      const stage = stageNames[index];
      const opp = selectedKnockoutOpponents[index];
      const match = simulateMatch(stage, opp, picks as DraftPick[], true);
      matches.push(match);
      const displayMatch = await revealMatch(match, displayMatches);
      displayMatches.push(displayMatch);

      const survived = match.outcome === 'W' || (match.outcome === 'D' && match.penaltyOutcome === 'W');
      if (!survived) {
        if (stage === 'Semi-final') {
          const unavailable = new Set([...groupOpponents.map((o: any) => o.country), ...selectedKnockoutOpponents.map((o: any) => o.country)]);
          const thirdPlaceOpponent = remainingOpponents.find((o: any) => !unavailable.has(o.country) && o.ovr >= 80) || remainingOpponents.find((o: any) => !unavailable.has(o.country));
          if (thirdPlaceOpponent) {
            const third = simulateMatch('Third-place playoff', thirdPlaceOpponent, picks as DraftPick[], true);
            matches.push(third);
            const thirdDisplay = await revealMatch(third, displayMatches);
            displayMatches.push(thirdDisplay);
            const wonThirdPlace = third.outcome === 'W' || (third.outcome === 'D' && third.penaltyOutcome === 'W');
            const final = buildTournamentResult(picks as DraftPick[], teamOverall, matches, groupFinish, wonThirdPlace ? 3 : 4, wonThirdPlace ? 'Bronze' : null, wonThirdPlace ? null : 'Third-place playoff');
            setResult(final);
            setSimRunning(false);
            return;
          }
        }

        const final = buildTournamentResult(picks as DraftPick[], teamOverall, matches, groupFinish, stage === 'Final' ? 2 : 16, stage === 'Final' ? 'Silver' : null, stage);
        setResult(final);
        setSimRunning(false);
        return;
      }
    }

    const final = buildTournamentResult(picks as DraftPick[], teamOverall, matches, groupFinish, 1, 'Gold', null);
    setResult(final);
    setSimRunning(false);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">World Cup draft</p>
        <h1 className="text-4xl font-bold text-white md:text-5xl">8-0</h1>
        <p className="mx-auto max-w-2xl text-gray-300">
          Build an XI from World Cup squads, run the tournament, and chase the perfect eight-win campaign.
        </p>
      </header>

      {phase === 'setup' && (
        <>
          <div className="space-y-5">
            <section className="rounded-lg border border-gray-700 bg-gray-800/80 p-4 md:p-5">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Draft setup</h2>
                  <p className="mt-1 text-sm text-gray-400">Choose the shape, era pool, and scouting view.</p>
                </div>
                <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
                  {slots.length} picks
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-5">
                {EIGHT_ZERO_FORMATIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormationId(option.id)}
                    className={`rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${
                      formationId === option.id
                        ? 'border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-950/20'
                        : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </section>

            <EraRangeSlider
              decadeStart={decadeStart}
              decadeEnd={decadeEnd}
              countryCount={eligibleCountries.length}
              onChange={(start, end) => {
                setDecadeStart(start);
                setDecadeEnd(end);
              }}
            />

            <section className="rounded-lg border border-gray-700 bg-gray-900/70 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-white">Player ratings</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Hidden by default for a cleaner draft. Toggle them on if you want extra scouting detail.
                  </p>
                </div>
                <div className="grid min-w-full grid-cols-2 gap-2 sm:min-w-[18rem]">
                  <button
                    type="button"
                    onClick={() => setShowPlayerStats(false)}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                      !showPlayerStats
                        ? 'border-blue-400 bg-blue-500 text-white'
                        : 'border-gray-700 bg-gray-950 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    Hidden
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPlayerStats(true)}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                      showPlayerStats
                        ? 'border-blue-400 bg-blue-500 text-white'
                        : 'border-gray-700 bg-gray-950 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    Visible
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-emerald-500/20 bg-gray-800 p-4 md:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Ready to draft?</h2>
                  <p className="mt-1 text-sm text-gray-400">Draw one squad at a time, fill every slot, then simulate the World Cup.</p>
                </div>
                <button
                  type="button"
                  onClick={handleStart}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-600 sm:min-w-[12rem]"
                >
                  Spin first squad
                </button>
              </div>
            </section>

            <section className="grid gap-3 text-sm text-gray-300 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-700 bg-gray-900/70 p-4">
                <div className="font-semibold text-white">1. Draw</div>
                <p className="mt-1">Land on a country and year from the selected era range.</p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-900/70 p-4">
                <div className="font-semibold text-white">2. Draft</div>
                <p className="mt-1">Choose one player, then place them into an open position.</p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-900/70 p-4">
                <div className="font-semibold text-white">3. Simulate</div>
                <p className="mt-1">Run the tournament and chase the perfect 8-0 record.</p>
              </div>
            </section>

            <section className="space-y-4 rounded-lg border border-gray-700 bg-gray-900/70 p-4 text-gray-300 md:p-5">
              <h2 className="text-lg font-bold text-white">What is 8-0?</h2>
              <p>
                <strong>8-0</strong> is a free World Cup draft game and squad builder where you draft an XI from random
                national squads spanning decades of tournament history.
              </p>
              <p>
                Spin the wheel to land on a real World Cup squad and year, draft players from that squad one position at
                a time, and mix modern stars with tournament legends to create your ultimate XI.
              </p>
              <p>
                Once your team is complete, simulate the full World Cup path from group stage to final and see how far
                your squad can go. Can you win the World Cup? Can you go unbeaten? Can you complete the perfect 8-0 run?
              </p>
              <p>
                Player ratings are based on each national team&apos;s historical World Cup performance, while current
                players are rated from team strength implied by 2026 World Cup betting odds. If a player appears in
                multiple World Cup squads, 8-0 uses their highest-rated version when you draft them.
              </p>

              <div>
                <h3 className="text-sm font-semibold text-white">How to play</h3>
                <ol className="mt-3 space-y-2 pl-5 text-sm">
                  <li>1. Spin the wheel - land on a real World Cup squad from a specific year.</li>
                  <li>2. Draft a player - pick one player from that squad and slot them into your formation.</li>
                  <li>3. Build your XI - repeat until all 11 positions are filled.</li>
                  <li>4. Simulate the tournament - play out the full World Cup path and chase 8 wins.</li>
                </ol>
              </div>
              <p className="pt-4 text-sm text-gray-500">
                Inspired by <a href="https://38-0.app/" className="text-cyan-300 hover:text-cyan-200">38-0.app</a>
              </p>
            </section>
          </div>
        </>
      )}

      {phase === 'rolling' && (
        <section className="space-y-6 rounded-lg bg-gray-800 p-5 md:p-6 text-center">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
            <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 shadow-lg shadow-black/20">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Draft roll</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center text-white sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Country</p>
                  <p className="mt-3 text-2xl font-bold">{rollingCountry}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Year</p>
                  <p className="mt-3 text-2xl font-bold">{rollingYear}</p>
                </div>
              </div>
            </div>
            <p className="text-gray-300">Drawing the next World Cup squad. Players appear when the draw lands.</p>
            <div className="mx-auto h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full animate-pulse rounded-full bg-cyan-400/70" />
            </div>
          </div>
        </section>
      )}

      {phase === 'ready' && lastPick && (
        <section className="space-y-6 rounded-lg bg-gray-800 p-5 md:p-6">
          <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 shadow-lg shadow-black/20">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Pick locked</p>
            <div className="mt-6 space-y-3 text-center text-white">
              <p className="text-lg font-semibold">{lastPick.player.name} has joined your squad.</p>
              <p className="text-sm text-gray-400">
                {lastPick.country}, {lastPick.year} • {lastPick.slotLabel}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-700 bg-gray-900/70 p-5">
            <div className="mb-4 text-sm text-gray-300">
              Your XI is ready for the next draw.
            </div>
            <div className="flex justify-center">
              <PitchLineup formation={formation} picks={picks} compact showRatings={showPlayerStats} />
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="mt-5 w-full rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Draw next squad
            </button>
          </div>
        </section>
      )}

      {phase === 'announce' && currentDraw && (
        <section className="space-y-6 rounded-lg bg-gray-800 p-5 md:p-6 text-center">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-white/10 bg-gray-900/80 p-6 shadow-lg shadow-black/20">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">In the draw</p>
            <h2 className="text-3xl font-bold text-white">Squad drawn</h2>
            <p className="text-lg text-gray-300">
              {currentDraw.country} {currentDraw.year}
            </p>
            <p className="max-w-md text-sm text-gray-400">
              Choose one player from this squad and place them in your XI.
            </p>
          </div>
        </section>
      )}

      {phase === 'draft' && currentDraw && (
        <div className="space-y-6">
          <section className="rounded-lg bg-gray-800 p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Pick {picks.length + 1} of {slots.length}</p>
                <h2 className="text-2xl font-bold text-white">
                  {currentDraw.country}, {currentDraw.year}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Team overall</p>
                <p className="text-2xl font-bold text-emerald-300">{teamOverall || '-'}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <PitchLineup formation={formation} picks={picks} compact showRatings={showPlayerStats} />
            </div>
          </section>

          <section className="rounded-lg bg-gray-800 p-4 md:p-5">
            <div className="mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Choose one player</h3>
                <p className="text-sm text-gray-400">
                  Select a player, then place them in an open slot.
                </p>
              </div>
            </div>

            {selectablePlayers.length === 0 && (
              <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                This squad has no players for your remaining slots. Take a new draw.
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {currentDraw.players.map((player) => {
                const openSlots = getOpenSlotsForPosition(picks, formation, player.position);
                const alreadyPicked = pickedNames.has(player.name);
                const disabled = alreadyPicked || openSlots.length === 0;
                const selected = selectedPlayerName === player.name;

                return (
                  <button
                    key={`${currentDraw.year}-${currentDraw.country}-${player.number}-${player.name}`}
                    type="button"
                    onClick={() => !disabled && setSelectedPlayerName(player.name)}
                    disabled={disabled}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      selected
                        ? 'border-blue-400 bg-blue-500/15'
                        : disabled
                          ? 'border-gray-700 bg-gray-900/40 opacity-45'
                          : 'border-gray-700 bg-gray-900/80 hover:border-cyan-400/50 hover:bg-gray-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-xs text-gray-400">{positionLabels[player.position]}</div>
                      </div>
                      <div className="rounded-full bg-gray-700 px-2 py-1 text-xs font-bold text-gray-100">
                        {player.position}
                      </div>
                    </div>
                    {showPlayerStats && (
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-300">
                        <span>Rating {player.maxRating}</span>
                        <span>Caps {player.caps}</span>
                        <span className="truncate">{player.club}</span>
                        <span>{player.dob}</span>
                      </div>
                    )}
                    {disabled && (
                      <div className="mt-2 text-xs text-gray-500">
                        {alreadyPicked ? 'Already drafted' : `${positionLabels[player.position]} slots full`}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedPlayer && (
              <div ref={slotSelectRef} className="mt-5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
                <h4 className="font-semibold text-white">Place {selectedPlayer.name}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPlayerSlots.map((slotOption) => (
                    <button
                      key={slotOption.id}
                      type="button"
                      onClick={() => handlePick(selectedPlayer, slotOption)}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                    >
                      {slotOption.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {phase === 'complete' && !result && (
        <div className="space-y-6">
          <section className="rounded-lg border border-emerald-500/20 bg-gray-800 p-5 text-center md:p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">Ready for the World Cup</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Your final XI is set</h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-300">
              Watch each match unfold goal by goal, from the group stage to wherever your squad lands.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={runTournament}
                className="rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={simRunning}
              >
                {simRunning ? 'Simulating...' : 'Start World Cup'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={simRunning}
                className="rounded-lg bg-gray-700 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-gray-600"
              >
                Change draft
              </button>
            </div>
            {simRunning && (
              <p className="mt-3 text-sm text-cyan-200">Live simulation running. Scores update as the goals go in.</p>
            )}
          </section>

          <section ref={simulatorRef} className="rounded-lg border border-gray-700 bg-gray-800 p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Match simulation</p>
                <h3 className="mt-1 text-xl font-bold text-white">Live tournament feed</h3>
              </div>
              <div className="flex gap-2 text-xs font-semibold">
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200">W {tournamentRecord.wins}</span>
                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-200">D {tournamentRecord.draws}</span>
                <span className="rounded-full bg-red-400/10 px-3 py-1 text-red-200">L {tournamentRecord.losses}</span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-lg border border-gray-700 bg-gray-950/70 p-5">
                {!currentMatch ? (
                  <div className="py-8 text-center text-gray-400">
                    Press Start World Cup to begin the group stage.
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">{currentMatch.stage}</div>
                        <div className="mt-1 text-sm text-gray-300">Opponent OVR {currentMatch.opponentOvr}</div>
                      </div>
                      <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
                        currentMatch.displayStatus === 'live'
                          ? 'bg-cyan-400/10 text-cyan-200'
                          : currentMatch.outcome === 'W'
                            ? 'bg-emerald-400/10 text-emerald-200'
                            : currentMatch.outcome === 'D'
                              ? 'bg-amber-400/10 text-amber-200'
                              : 'bg-red-400/10 text-red-200'
                      }`}>
                        {currentMatch.displayStatus === 'live' ? `${currentMatch.displayMinute || 1}' live` : 'full time'}
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
                      <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-emerald-200">Your XI</div>
                      </div>
                      <div className="min-w-[7.5rem] rounded-lg bg-gray-900 px-4 py-3 text-4xl font-black text-white shadow-inner shadow-black/40">
                        <span className={currentMatch.goalsFor > currentMatch.goalsAgainst ? 'text-emerald-300' : 'text-white'}>
                          {currentMatch.goalsFor}
                        </span>
                        <span className="px-2 text-gray-500">-</span>
                        <span className={currentMatch.goalsAgainst > currentMatch.goalsFor ? 'text-red-300' : 'text-white'}>
                          {currentMatch.goalsAgainst}
                        </span>
                      </div>
                      <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-red-200">{currentMatch.opponent}</div>
                      </div>
                    </div>

                    <div className={`rounded-lg border px-4 py-3 ${getMatchBorderTone(currentMatch)}`}>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        {currentMatch.displayStatus === 'live' && <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />}
                        <span>{currentMatch.displayEvent}</span>
                      </div>
                    </div>

                    {currentMatch.displayEvents.length > 1 && (
                      <div className="space-y-2">
                        {currentMatch.displayEvents.slice(-4).map((event, index) => (
                          <div key={`${event}-${index}`} className="rounded-lg bg-gray-900/80 px-3 py-2 text-sm text-gray-300">
                            {event}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-gray-700 bg-gray-950/70 p-4">
                <h4 className="font-semibold text-white">Tournament progress</h4>
                {simMatches.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-400">Results will appear here as each match finishes.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {simMatches.map((match, index) => (
                      <div key={`${match.stage}-${match.opponent}-${index}`} className={`rounded-lg border px-3 py-2 ${getMatchBorderTone(match)}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-white">{match.stage}</div>
                            <div className="text-xs text-gray-400">vs {match.opponent}</div>
                          </div>
                          <div className={`text-lg font-black ${match.displayStatus === 'final' ? getMatchTone(match) : 'text-cyan-200'}`}>
                            {match.goalsFor}-{match.goalsAgainst}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {match.displayStatus === 'live' ? `${match.displayMinute || 1}' live` : getMatchLabel(match)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-lg bg-gray-800 p-4 md:p-5">
            <h3 className="mb-4 text-lg font-bold text-white">Final XI</h3>
            <div className="flex justify-center">
              <PitchLineup formation={formation} picks={picks} showRatings={showPlayerStats} />
            </div>
          </section>
        </div>
      )}

      {phase === 'complete' && result && (
        <div className="space-y-6">
          <section className="rounded-lg bg-gray-800 p-5 text-center md:p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">
              {result.medal ? `${result.medal} medal` : result.eliminatedAt ? `Out at ${result.eliminatedAt}` : 'Tournament complete'}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              {result.wonWorldCup && result.undefeated ? '8-0 completed' : result.wonWorldCup ? 'World Cup won' : result.eliminatedAt ? `Out at ${result.eliminatedAt}` : `Finished ${result.finish}`}
            </h2>
            <p className="mt-2 text-gray-300">
              Record {result.record.wins}-{result.record.draws}-{result.record.losses} with a {result.teamOverall} overall XI.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleShareYourWorldCup}
                disabled={shareSaving}
                className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {shareSaving ? 'Saving...' : 'Share your World Cup'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-gray-700 px-5 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
              >
                Play Again
              </button>
            </div>
            {shareError && <p className="mt-3 text-sm text-red-400">{shareError}</p>}
          </section>

          <section className="rounded-lg bg-gray-800 p-4 md:p-5">
            <h3 className="mb-4 text-lg font-bold text-white">Final XI</h3>
            <div className="flex justify-center">
              <PitchLineup formation={formation} picks={picks} showRatings={showPlayerStats} />
            </div>
          </section>

          <section className="rounded-lg bg-gray-800 p-4 md:p-5">
            <h3 className="text-lg font-bold text-white">Results</h3>
            <div className="mt-4 space-y-2">
              {result.matches.map((match) => (
                <div
                  key={`${match.stage}-${match.opponent}`}
                  className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white">{match.stage}</div>
                    <div className="text-sm text-gray-400">vs {match.opponent} ({match.opponentOvr})</div>
                    {match.userScorers.length > 0 && (
                      <div className="mt-1 truncate text-xs text-gray-500">
                        Goals: {match.userScorers.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="justify-self-end text-right">
                    <div className={`text-xl font-bold ${match.outcome === 'W' ? 'text-emerald-300' : match.outcome === 'D' ? 'text-amber-300' : 'text-red-300'}`}>
                      {getMatchLabel(match)}
                    </div>
                    <div className="text-xs text-gray-400">{match.outcome}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-gray-800 p-4 md:p-5">
            <h3 className="text-lg font-bold text-white">Player Stats</h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-700">
              <div className="grid grid-cols-[1fr_3rem_3rem_3rem] bg-gray-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                <span>Player</span>
                <span className="text-center">G</span>
                <span className="text-center">A</span>
                <span className="text-center">CS</span>
              </div>
              {result.playerStats.map((player) => (
                <div
                  key={player.name}
                  className="grid grid-cols-[1fr_3rem_3rem_3rem] border-t border-gray-700 px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-semibold text-white">{player.name}</span>
                    <span className="ml-2 text-xs text-gray-500">{player.slot} {player.rating}</span>
                  </span>
                  <span className="text-center text-gray-200">{player.goals}</span>
                  <span className="text-center text-gray-200">{player.assists}</span>
                  <span className="text-center text-gray-200">{player.cleanSheets}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gray-700 bg-gray-900/70 p-5 text-center">
            <p className="text-gray-300">Want a different Footle challenge?</p>
            <Link
              href="/"
              prefetch={false}
              className="mt-3 inline-block rounded-lg bg-white px-5 py-2 font-semibold text-gray-900 transition-colors hover:bg-gray-200"
            >
              More Modes
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}
