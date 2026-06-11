import squadsData from '../data/squads_with_ratings.json';
import teamAbilityData from '../data/team_ability.json';

export type EightZeroPosition = 'GK' | 'DF' | 'MF' | 'FW';
export type EightZeroPhase = 'setup' | 'draft' | 'complete';
export type EightZeroCountryMode = 'all' | 'single';

export interface WorldCupPlayer {
  number: string;
  position: EightZeroPosition;
  name: string;
  dob: string;
  caps: string;
  club: string;
  rating: number;
}

export interface DraftPlayer extends WorldCupPlayer {
  maxRating: number;
}

export interface DraftDraw {
  year: string;
  country: string;
  players: DraftPlayer[];
}

export interface FormationSlot {
  id: string;
  label: string;
  position: EightZeroPosition;
  row: number;
}

export interface FormationDefinition {
  id: string;
  name: string;
  rows: FormationSlot[][];
}

export interface DraftPick {
  slotId: string;
  slotLabel: string;
  player: DraftPlayer;
  country: string;
  year: string;
}

export interface OpponentTeam {
  country: string;
  ovr: number;
}

export interface SimulatedMatch {
  stage: string;
  opponent: string;
  opponentOvr: number;
  goalsFor: number;
  goalsAgainst: number;
  outcome: 'W' | 'D' | 'L';
  penaltyOutcome?: 'W' | 'L';
  userScorers: string[];
  userAssists: string[];
  cleanSheet: boolean;
}

export interface PlayerTournamentStats {
  name: string;
  slot: string;
  position: EightZeroPosition;
  rating: number;
  goals: number;
  assists: number;
  cleanSheets: number;
}

export interface TournamentResult {
  teamOverall: number;
  record: {
    wins: number;
    draws: number;
    losses: number;
  };
  groupFinish: number;
  matches: SimulatedMatch[];
  playerStats: PlayerTournamentStats[];
  finish: number;
  medal: 'Gold' | 'Silver' | 'Bronze' | null;
  eliminatedAt: string | null;
  undefeated: boolean;
  wonWorldCup: boolean;
}

const EIGHT_ZERO_SIMULATION_BOOST = 10;

type SquadsByYear = Record<string, Record<string, WorldCupPlayer[]>>;

const squads = squadsData as SquadsByYear;

const slot = (id: string, label: string, position: EightZeroPosition, row: number): FormationSlot => ({
  id,
  label,
  position,
  row,
});

export const EIGHT_ZERO_FORMATIONS: FormationDefinition[] = [
  {
    id: '433',
    name: '4-3-3',
    rows: [
      [slot('lw', 'LW', 'FW', 0), slot('st', 'ST', 'FW', 0), slot('rw', 'RW', 'FW', 0)],
      [slot('lcm', 'CM', 'MF', 1), slot('cm', 'CM', 'MF', 1), slot('rcm', 'CM', 'MF', 1)],
      [slot('lb', 'LB', 'DF', 2), slot('lcb', 'CB', 'DF', 2), slot('rcb', 'CB', 'DF', 2), slot('rb', 'RB', 'DF', 2)],
      [slot('gk', 'GK', 'GK', 3)],
    ],
  },
  {
    id: '442',
    name: '4-4-2',
    rows: [
      [slot('lst', 'ST', 'FW', 0), slot('rst', 'ST', 'FW', 0)],
      [slot('lm', 'LM', 'MF', 1), slot('lcm', 'CM', 'MF', 1), slot('rcm', 'CM', 'MF', 1), slot('rm', 'RM', 'MF', 1)],
      [slot('lb', 'LB', 'DF', 2), slot('lcb', 'CB', 'DF', 2), slot('rcb', 'CB', 'DF', 2), slot('rb', 'RB', 'DF', 2)],
      [slot('gk', 'GK', 'GK', 3)],
    ],
  },
  {
    id: '4231',
    name: '4-2-3-1',
    rows: [
      [slot('st', 'ST', 'FW', 0)],
      [slot('lam', 'AM', 'MF', 1), slot('cam', 'AM', 'MF', 1), slot('ram', 'AM', 'MF', 1)],
      [slot('ldm', 'DM', 'MF', 2), slot('rdm', 'DM', 'MF', 2)],
      [slot('lb', 'LB', 'DF', 3), slot('lcb', 'CB', 'DF', 3), slot('rcb', 'CB', 'DF', 3), slot('rb', 'RB', 'DF', 3)],
      [slot('gk', 'GK', 'GK', 4)],
    ],
  },
  {
    id: '352',
    name: '3-5-2',
    rows: [
      [slot('lst', 'ST', 'FW', 0), slot('rst', 'ST', 'FW', 0)],
      [slot('lm', 'LM', 'MF', 1), slot('lcm', 'CM', 'MF', 1), slot('cm', 'CM', 'MF', 1), slot('rcm', 'CM', 'MF', 1), slot('rm', 'RM', 'MF', 1)],
      [slot('lcb', 'CB', 'DF', 2), slot('cb', 'CB', 'DF', 2), slot('rcb', 'CB', 'DF', 2)],
      [slot('gk', 'GK', 'GK', 3)],
    ],
  },
  {
    id: '343',
    name: '3-4-3',
    rows: [
      [slot('lw', 'LW', 'FW', 0), slot('st', 'ST', 'FW', 0), slot('rw', 'RW', 'FW', 0)],
      [slot('lm', 'LM', 'MF', 1), slot('lcm', 'CM', 'MF', 1), slot('rcm', 'CM', 'MF', 1), slot('rm', 'RM', 'MF', 1)],
      [slot('lcb', 'CB', 'DF', 2), slot('cb', 'CB', 'DF', 2), slot('rcb', 'CB', 'DF', 2)],
      [slot('gk', 'GK', 'GK', 3)],
    ],
  },
];

const allPlayers = Object.values(squads).flatMap((countries) => Object.values(countries).flat());
const maxRatingByName = allPlayers.reduce<Record<string, number>>((ratings, player) => {
  ratings[player.name] = Math.max(ratings[player.name] ?? 0, Number(player.rating) || 0);
  return ratings;
}, {});

export const EIGHT_ZERO_YEARS = Object.keys(squads).sort((a, b) => Number(a) - Number(b));

export const EIGHT_ZERO_DECADES = Array.from(
  new Set(EIGHT_ZERO_YEARS.map((year) => Math.floor(Number(year) / 10) * 10))
).sort((a, b) => a - b);

export const EIGHT_ZERO_COUNTRIES = Array.from(
  new Set(Object.values(squads).flatMap((countries) => Object.keys(countries)))
).sort((a, b) => a.localeCompare(b));

export const EIGHT_ZERO_OPPONENTS: OpponentTeam[] = teamAbilityData.tiers.flatMap((tier) => tier.teams);

export function getFormationById(id: string): FormationDefinition {
  return EIGHT_ZERO_FORMATIONS.find((formation) => formation.id === id) ?? EIGHT_ZERO_FORMATIONS[0];
}

export function getFlatFormationSlots(formation: FormationDefinition): FormationSlot[] {
  return formation.rows.flat();
}

export function getOpenSlotsForPosition(
  picks: DraftPick[],
  formation: FormationDefinition,
  position: EightZeroPosition
): FormationSlot[] {
  const usedSlotIds = new Set(picks.map((pick) => pick.slotId));
  return getFlatFormationSlots(formation).filter((slot) => slot.position === position && !usedSlotIds.has(slot.id));
}

export function isTeamComplete(picks: DraftPick[], formation: FormationDefinition): boolean {
  return picks.length >= getFlatFormationSlots(formation).length;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getEligibleYears(decadeStart: number, decadeEnd: number): string[] {
  return EIGHT_ZERO_YEARS.filter((year) => {
    const decade = Math.floor(Number(year) / 10) * 10;
    return decade >= decadeStart && decade <= decadeEnd;
  });
}

export function getCountriesForDecades(decadeStart: number, decadeEnd: number): string[] {
  return Array.from(
    new Set(getEligibleYears(decadeStart, decadeEnd).flatMap((year) => Object.keys(squads[year] ?? {})))
  ).sort((a, b) => a.localeCompare(b));
}

export function createDraftDraw(options: {
  countryMode: EightZeroCountryMode;
  selectedCountry: string;
  decadeStart: number;
  decadeEnd: number;
  picks: DraftPick[];
  formation: FormationDefinition;
}): DraftDraw {
  const pickedNames = new Set(options.picks.map((pick) => pick.player.name));
  const eligibleYears = getEligibleYears(options.decadeStart, options.decadeEnd);
  const openPositions = new Set(
    getFlatFormationSlots(options.formation)
      .filter((slot) => !options.picks.some((pick) => pick.slotId === slot.id))
      .map((slot) => slot.position)
  );

  const candidates: DraftDraw[] = [];

  eligibleYears.forEach((year) => {
    Object.entries(squads[year] ?? {}).forEach(([country, players]) => {
      if (options.countryMode === 'single' && country !== options.selectedCountry) {
        return;
      }

      const draftPlayers = players.map((player) => ({
        ...player,
        maxRating: (maxRatingByName[player.name] ?? Number(player.rating)) || 0,
      }));

      if (draftPlayers.some((player) => openPositions.has(player.position) && !pickedNames.has(player.name))) {
        candidates.push({ year, country, players: draftPlayers });
      }
    });
  });

  if (candidates.length > 0) {
    return randomItem(candidates);
  }

  const fallbackYear = randomItem(eligibleYears.length ? eligibleYears : EIGHT_ZERO_YEARS);
  const fallbackEntries = Object.entries(squads[fallbackYear] ?? {});
  const [country, players] = options.countryMode === 'single'
    ? fallbackEntries.find(([entryCountry]) => entryCountry === options.selectedCountry) ?? randomItem(fallbackEntries)
    : randomItem(fallbackEntries);

  return {
    year: fallbackYear,
    country,
    players: players.map((player) => ({
      ...player,
      maxRating: (maxRatingByName[player.name] ?? Number(player.rating)) || 0,
    })),
  };
}

export function calculateTeamOverall(picks: DraftPick[]): number {
  if (picks.length === 0) {
    return 0;
  }

  const weightedTotal = picks.reduce((sum, pick) => {
    const weight = pick.player.position === 'GK' ? 1.05 : pick.player.position === 'FW' ? 1.03 : 1;
    return sum + pick.player.maxRating * weight;
  }, 0);

  const totalWeight = picks.reduce((sum, pick) => {
    return sum + (pick.player.position === 'GK' ? 1.05 : pick.player.position === 'FW' ? 1.03 : 1);
  }, 0);

  return Math.round((weightedTotal / totalWeight) * 10) / 10;
}

export function getSimulationTeamOverall(teamOverall: number): number {
  return Math.round((teamOverall + EIGHT_ZERO_SIMULATION_BOOST) * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function poisson(mean: number): number {
  const threshold = Math.exp(-mean);
  let product = 1;
  let count = 0;

  do {
    count += 1;
    product *= Math.random();
  } while (product > threshold);

  return count - 1;
}

function pickScorer(picks: DraftPick[]): DraftPick {
  const weights: Record<EightZeroPosition, number> = {
    GK: 0.02,
    DF: 0.35,
    MF: 1.1,
    FW: 1.85,
  };
  const total = picks.reduce((sum, pick) => sum + weights[pick.player.position] * pick.player.maxRating, 0);
  let roll = Math.random() * total;

  for (const pick of picks) {
    roll -= weights[pick.player.position] * pick.player.maxRating;
    if (roll <= 0) {
      return pick;
    }
  }

  return picks[picks.length - 1];
}

function pickAssister(picks: DraftPick[], scorerName: string): DraftPick {
  const weights: Record<EightZeroPosition, number> = {
    GK: 0.04,
    DF: 0.45,
    MF: 1.65,
    FW: 1,
  };
  const candidates = picks.filter((pick) => pick.player.name !== scorerName);
  const total = candidates.reduce((sum, pick) => sum + weights[pick.player.position] * pick.player.maxRating, 0);
  let roll = Math.random() * total;

  for (const pick of candidates) {
    roll -= weights[pick.player.position] * pick.player.maxRating;
    if (roll <= 0) {
      return pick;
    }
  }

  return candidates[candidates.length - 1] ?? picks[0];
}

function simulateFixture(
  stage: string,
  opponent: OpponentTeam,
  teamOverall: number,
  picks: DraftPick[],
  knockout: boolean
): SimulatedMatch {
  const edge = clamp((teamOverall - opponent.ovr) / 14, -1.1, 1.1);
  const userMean = clamp(1.35 + edge, 0.35, 3.1);
  const opponentMean = clamp(1.18 - edge, 0.25, 2.8);
  let goalsFor = poisson(userMean);
  let goalsAgainst = poisson(opponentMean);

  if (stage === 'Final') {
    goalsAgainst += Math.random() < 0.08 ? 1 : 0;
  }

  let outcome: SimulatedMatch['outcome'] = goalsFor > goalsAgainst ? 'W' : goalsFor < goalsAgainst ? 'L' : 'D';
  let penaltyOutcome: SimulatedMatch['penaltyOutcome'];

  if (knockout && outcome === 'D') {
    const penaltyChance = clamp(0.5 + edge * 0.16, 0.25, 0.75);
    penaltyOutcome = Math.random() < penaltyChance ? 'W' : 'L';
  }

  const userScorers: string[] = [];
  const userAssists: string[] = [];

  for (let i = 0; i < goalsFor; i += 1) {
    const scorer = pickScorer(picks);
    userScorers.push(scorer.player.name);

    if (Math.random() < 0.72) {
      userAssists.push(pickAssister(picks, scorer.player.name).player.name);
    }
  }

  return {
    stage,
    opponent: opponent.country,
    opponentOvr: opponent.ovr,
    goalsFor,
    goalsAgainst,
    outcome,
    penaltyOutcome,
    userScorers,
    userAssists,
    cleanSheet: goalsAgainst === 0,
  };
}

function simulateNeutralFixture(teamA: OpponentTeam, teamB: OpponentTeam): { aGoals: number; bGoals: number } {
  const edge = clamp((teamA.ovr - teamB.ovr) / 16, -1, 1);
  return {
    aGoals: poisson(clamp(1.2 + edge, 0.35, 2.8)),
    bGoals: poisson(clamp(1.2 - edge, 0.35, 2.8)),
  };
}

function rankGroup(rows: Array<{ country: string; points: number; gd: number; gf: number }>) {
  return [...rows].sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.country.localeCompare(b.country));
}

function recordGroupMatch(
  rowA: { country: string; points: number; gd: number; gf: number },
  rowB: { country: string; points: number; gd: number; gf: number },
  goalsA: number,
  goalsB: number
) {
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

export function simulateTournament(picks: DraftPick[]): TournamentResult {
  const teamOverall = calculateTeamOverall(picks);
  const simulationTeamOverall = getSimulationTeamOverall(teamOverall);
  const shuffledOpponents = shuffle(EIGHT_ZERO_OPPONENTS);
  const groupOpponents = shuffledOpponents.slice(0, 3);
  const rows = [
    { country: 'Your XI', points: 0, gd: 0, gf: 0 },
    ...groupOpponents.map((opponent) => ({ country: opponent.country, points: 0, gd: 0, gf: 0 })),
  ];
  const rowByCountry = new Map(rows.map((row) => [row.country, row]));
  const matches: SimulatedMatch[] = [];

  groupOpponents.forEach((opponent, index) => {
    const match = simulateFixture(`Group ${index + 1}`, opponent, simulationTeamOverall, picks, false);
    matches.push(match);
    recordGroupMatch(rowByCountry.get('Your XI')!, rowByCountry.get(opponent.country)!, match.goalsFor, match.goalsAgainst);
  });

  for (let i = 0; i < groupOpponents.length; i += 1) {
    for (let j = i + 1; j < groupOpponents.length; j += 1) {
      const teamA = groupOpponents[i];
      const teamB = groupOpponents[j];
      const result = simulateNeutralFixture(teamA, teamB);
      recordGroupMatch(rowByCountry.get(teamA.country)!, rowByCountry.get(teamB.country)!, result.aGoals, result.bGoals);
    }
  }

  const rankedGroup = rankGroup(rows);
  const groupFinish = rankedGroup.findIndex((row) => row.country === 'Your XI') + 1;
  const userRow = rowByCountry.get('Your XI')!;
  const qualified = groupFinish <= 2 || (groupFinish === 3 && (userRow.points >= 4 || (userRow.points === 3 && userRow.gd >= 0)));

  if (!qualified) {
    return buildTournamentResult(picks, teamOverall, matches, groupFinish, 33, null, 'Group stage');
  }

  const usedCountries = new Set(groupOpponents.map((opponent) => opponent.country));
  const remainingOpponents = shuffledOpponents.filter((opponent) => !usedCountries.has(opponent.country));
  const roundPools = [
    remainingOpponents.filter((opponent) => opponent.ovr <= 80),
    remainingOpponents.filter((opponent) => opponent.ovr >= 76 && opponent.ovr <= 85),
    remainingOpponents.filter((opponent) => opponent.ovr >= 80),
    remainingOpponents.filter((opponent) => opponent.ovr >= 82),
    remainingOpponents.filter((opponent) => opponent.ovr >= 85),
  ];
  const stageNames = ['Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', 'Final'];
  const selectedKnockoutOpponents: OpponentTeam[] = [];

  stageNames.forEach((_, index) => {
    const unavailable = new Set([...usedCountries, ...selectedKnockoutOpponents.map((opponent) => opponent.country)]);
    const pool = roundPools[index].filter((opponent) => !unavailable.has(opponent.country));
    selectedKnockoutOpponents.push(randomItem(pool.length ? pool : remainingOpponents.filter((opponent) => !unavailable.has(opponent.country))));
  });

  for (let index = 0; index < stageNames.length; index += 1) {
    const stage = stageNames[index];
    const match = simulateFixture(stage, selectedKnockoutOpponents[index], simulationTeamOverall, picks, true);
    matches.push(match);
    const survived = match.outcome === 'W' || (match.outcome === 'D' && match.penaltyOutcome === 'W');

    if (!survived) {
      if (stage === 'Semi-final') {
        const unavailable = new Set([...usedCountries, ...selectedKnockoutOpponents.map((opponent) => opponent.country)]);
        const thirdPlaceOpponent = randomItem(
          remainingOpponents.filter((opponent) => !unavailable.has(opponent.country) && opponent.ovr >= 80)
        ) ?? randomItem(remainingOpponents.filter((opponent) => !unavailable.has(opponent.country)));
        const thirdPlaceMatch = simulateFixture('Third-place playoff', thirdPlaceOpponent, simulationTeamOverall, picks, true);
        matches.push(thirdPlaceMatch);
        const wonThirdPlace = thirdPlaceMatch.outcome === 'W' || (thirdPlaceMatch.outcome === 'D' && thirdPlaceMatch.penaltyOutcome === 'W');
        return buildTournamentResult(picks, teamOverall, matches, groupFinish, wonThirdPlace ? 3 : 4, wonThirdPlace ? 'Bronze' : null, wonThirdPlace ? null : 'Third-place playoff');
      }

      return buildTournamentResult(picks, teamOverall, matches, groupFinish, stage === 'Final' ? 2 : 16, stage === 'Final' ? 'Silver' : null, stage);
    }
  }

  return buildTournamentResult(picks, teamOverall, matches, groupFinish, 1, 'Gold', null);
}

export function prepareTournament(picks: DraftPick[]) {
  const teamOverall = calculateTeamOverall(picks);
  const simulationTeamOverall = getSimulationTeamOverall(teamOverall);
  const shuffledOpponents = shuffle(EIGHT_ZERO_OPPONENTS);

  const pool4 = shuffledOpponents.filter((o) => o.ovr <= 78);
  const pool3 = shuffledOpponents.filter((o) => o.ovr > 78 && o.ovr <= 84);
  const pool2 = shuffledOpponents.filter((o) => o.ovr > 84);

  const used = new Set<string>();
  const pickFromPool = (pool: OpponentTeam[]) => {
    const available = pool.filter((o) => !used.has(o.country));
    const selection = available.length ? randomItem(available) : randomItem(shuffledOpponents.filter((o) => !used.has(o.country)));
    used.add(selection.country);
    return selection;
  };

  const groupOpponents = [pickFromPool(pool4), pickFromPool(pool3), pickFromPool(pool2)];
  const usedCountries = new Set(groupOpponents.map((o) => o.country));
  const remainingOpponents = shuffledOpponents.filter((o) => !usedCountries.has(o.country));

  const roundPools = [
    remainingOpponents.filter((opponent) => opponent.ovr <= 80),
    remainingOpponents.filter((opponent) => opponent.ovr >= 76 && opponent.ovr <= 85),
    remainingOpponents.filter((opponent) => opponent.ovr >= 80),
    remainingOpponents.filter((opponent) => opponent.ovr >= 82),
    remainingOpponents.filter((opponent) => opponent.ovr >= 85),
  ];

  const stageNames = ['Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', 'Final'];
  const selectedKnockoutOpponents: OpponentTeam[] = [];

  stageNames.forEach((_, index) => {
    const unavailable = new Set([...usedCountries, ...selectedKnockoutOpponents.map((o) => o.country)]);
    const pool = roundPools[index].filter((opponent) => !unavailable.has(opponent.country));
    selectedKnockoutOpponents.push(randomItem(pool.length ? pool : remainingOpponents.filter((opponent) => !unavailable.has(opponent.country))));
  });

  return { teamOverall, simulationTeamOverall, groupOpponents, remainingOpponents, selectedKnockoutOpponents, stageNames };
}

export function simulateMatch(stage: string, opponent: OpponentTeam, picks: DraftPick[], knockout: boolean): SimulatedMatch {
  return simulateFixture(stage, opponent, getSimulationTeamOverall(calculateTeamOverall(picks)), picks, knockout);
}

export function buildTournamentResult(
  picks: DraftPick[],
  teamOverall: number,
  matches: SimulatedMatch[],
  groupFinish: number,
  finish: number,
  medal: TournamentResult['medal'],
  eliminatedAt: string | null
): TournamentResult {
  const statsByName = new Map<string, PlayerTournamentStats>();

  picks.forEach((pick) => {
    statsByName.set(pick.player.name, {
      name: pick.player.name,
      slot: pick.slotLabel,
      position: pick.player.position,
      rating: pick.player.maxRating,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
    });
  });

  matches.forEach((match) => {
    match.userScorers.forEach((name) => {
      const stats = statsByName.get(name);
      if (stats) stats.goals += 1;
    });
    match.userAssists.forEach((name) => {
      const stats = statsByName.get(name);
      if (stats) stats.assists += 1;
    });
    if (match.cleanSheet) {
      picks.forEach((pick) => {
        if (pick.player.position === 'GK' || pick.player.position === 'DF') {
          const stats = statsByName.get(pick.player.name);
          if (stats) stats.cleanSheets += 1;
        }
      });
    }
  });

  const record = matches.reduce(
    (current, match) => {
      if (match.outcome === 'W') current.wins += 1;
      if (match.outcome === 'D') current.draws += 1;
      if (match.outcome === 'L') current.losses += 1;
      return current;
    },
    { wins: 0, draws: 0, losses: 0 }
  );

  return {
    teamOverall,
    record,
    groupFinish,
    matches,
    playerStats: Array.from(statsByName.values()).sort((a, b) => b.goals - a.goals || b.assists - a.assists || b.rating - a.rating),
    finish,
    medal,
    eliminatedAt,
    undefeated: record.losses === 0,
    wonWorldCup: finish === 1,
  };
}
