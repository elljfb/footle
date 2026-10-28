import teamRatings from '../data/player_of_the_season/team_ratings.json';

export type PositionGroup =
  | 'goalkeeper'
  | 'centre_back'
  | 'full_back_wing_back'
  | 'defensive_midfielder'
  | 'central_midfielder'
  | 'attacking_midfielder'
  | 'winger'
  | 'striker';

export type PlayerPosition =
  | 'Centre-Back'
  | 'Full-Back'
  | 'Defensive Midfielder'
  | 'Centre Midfielder'
  | 'Attacking Midfielder'
  | 'Winger'
  | 'Striker';
export type PreferredFoot = 'Left' | 'Right' | 'Both';

export interface AttributeSet {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface TeamRating {
  id: string;
  name: string;
  short_name: string;
  overall: number;
  preferred_formation: string;
  position_strengths: Record<PositionGroup, number>;
  squad_depth: number;
  competition_for_places: 'Low' | 'Medium' | 'High';
  simulation_modifiers: {
    chance_creation: number;
    defensive_stability: number;
    attacking_threat: number;
    rotation_quality: number;
  };
}

export interface PlayerBuild {
  name: string;
  nationality: string;
  age: number;
  height: number;
  weight: number;
  preferredFoot: PreferredFoot;
  position: PlayerPosition;
  attributes: AttributeSet;
  clubId: string;
}

export interface LeagueTableEntry {
  team: TeamRating;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface PlayerSeasonSummary {
  club: TeamRating;
  table: LeagueTableEntry[];
  summaryLabel?: string;
  award?: string;
  awards?: string[];
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  goldenBootTarget?: number;
  goldenPlaymakerTarget?: number;
  averageRating: number;
  ratingText: string;
  shareText: string;
  tablePosition: number;
  results: PlayerMatchResult[];
}

const SEASON_AWARDS = ['Golden Boot', 'Golden Playmaker', 'Player of the Season'];
export const NATIONALITY_OPTIONS = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Cameroon', 'Canada',
  'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt',
  'England', 'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hungary',
  'Iceland', 'India', 'Iran', 'Ireland', 'Italy', 'Ivory Coast', 'Jamaica',
  'Japan', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria',
  'Northern Ireland', 'Norway', 'Peru', 'Poland', 'Portugal', 'Romania',
  'Scotland', 'Senegal', 'Serbia', 'South Africa', 'South Korea', 'Spain',
  'Sweden', 'Switzerland', 'Tunisia', 'Turkey', 'Ukraine', 'United States',
  'Uruguay', 'Wales',
];

export function getSeasonSummaryLabel(
  season: Pick<PlayerSeasonSummary, 'summaryLabel' | 'award' | 'awards' | 'appearances' | 'minutes' | 'goals' | 'assists' | 'averageRating'>,
  playerAge?: number,
): string {
  if (season.summaryLabel) return season.summaryLabel;
  const awards = getSeasonAwards(season);
  if (awards.includes('Player of the Season')) return 'Player of the Season';
  if (
    playerAge !== undefined &&
    playerAge <= 18 &&
    season.appearances >= 20 &&
    season.averageRating >= 6.8
  ) {
    return 'Potential wonderkid';
  }
  if (
    playerAge !== undefined &&
    playerAge <= 21 &&
    season.appearances >= 20 &&
    season.averageRating >= 7
  ) {
    return 'Breakthrough season';
  }
  if (season.appearances >= 25 && season.averageRating >= 7.5) return 'Outstanding season';
  if (season.appearances >= 20 && season.goals + season.assists >= 25) return 'Attacking star';
  if (
    playerAge !== undefined &&
    playerAge >= 35 &&
    season.appearances >= 20 &&
    season.averageRating >= 6.8
  ) {
    return 'Elder statesman';
  }
  if (
    playerAge !== undefined &&
    playerAge >= 32 &&
    season.appearances >= 25 &&
    season.averageRating >= 7
  ) {
    return 'Veteran leader';
  }
  if (playerAge !== undefined && playerAge >= 35 && season.appearances >= 10) return 'Experienced veteran';
  if (season.appearances === 38) return 'Ever-present';
  if (season.appearances >= 30 && season.minutes >= 1800) return 'Regular starter';
  if (season.appearances >= 20 && season.minutes >= 1200) return 'First-team regular';
  if (season.appearances >= 10) return 'Squad player';
  if (season.appearances > 0) return 'Limited role';
  return 'Did not feature';
}

export function getSeasonAwards(
  season: Pick<PlayerSeasonSummary, 'awards' | 'award'>,
): string[] {
  const awards = season.awards ?? (season.award ? [season.award] : []);
  return awards.filter((award) => SEASON_AWARDS.includes(award));
}

export interface PlayerMatchResult {
  round: number;
  home: TeamRating;
  away: TeamRating;
  homeGoals: number;
  awayGoals: number;
  playerPlayed: boolean;
  playerMinutes: number;
  playerGoals: number;
  playerAssists: number;
  playerRating: number | null;
}

export function getClubMatchOutcome(
  result: PlayerMatchResult,
  clubId: string,
): 'win' | 'draw' | 'loss' {
  const isHome = result.home.id === clubId;
  const clubGoals = isHome ? result.homeGoals : result.awayGoals;
  const opponentGoals = isHome ? result.awayGoals : result.homeGoals;
  if (clubGoals === opponentGoals) return 'draw';
  return clubGoals > opponentGoals ? 'win' : 'loss';
}

export const TEAM_DATA = teamRatings as { teams: TeamRating[] };
export const CLUBS = TEAM_DATA.teams;
export const MAX_ATTRIBUTE_POINTS = 420;
export const GOLDEN_BOOT_GOAL_TOTALS = [
  22, 34, 34, 31, 25, 18, 18, 30, 23, 24, 25, 30, 25, 27, 20, 31, 19,
  29, 20, 30, 26, 31, 26, 25, 29, 32, 22, 23, 23, 23, 36, 27, 29, 27,
];
export const GOLDEN_PLAYMAKER_ASSIST_TOTALS = [
  16, 13, 15, 15, 12, 13, 13, 15, 12, 15, 20, 14, 18, 11, 11, 17, 10,
  16, 14, 15, 12, 13, 19, 19, 18, 16, 15, 20, 14, 13, 16, 13, 18, 21,
];

export const POSITION_OPTIONS: { value: PlayerPosition; label: string; group: PositionGroup }[] = [
  { value: 'Centre-Back', label: 'Centre-Back', group: 'centre_back' },
  { value: 'Full-Back', label: 'Full-Back', group: 'full_back_wing_back' },
  { value: 'Defensive Midfielder', label: 'Defensive Midfielder', group: 'defensive_midfielder' },
  { value: 'Centre Midfielder', label: 'Centre Midfielder', group: 'central_midfielder' },
  { value: 'Attacking Midfielder', label: 'Attacking Midfielder', group: 'attacking_midfielder' },
  { value: 'Winger', label: 'Winger', group: 'winger' },
  { value: 'Striker', label: 'Striker', group: 'striker' },
];

export const FOOT_OPTIONS: PreferredFoot[] = ['Left', 'Right', 'Both'];

export const ATTRIBUTE_LABELS: Array<keyof AttributeSet> = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getDefaultAttributes(position: PlayerPosition): AttributeSet {
  switch (position) {
    case 'Centre-Back':
      return { pace: 76, shooting: 25, passing: 80, dribbling: 40, defending: 100, physical: 99 };
    case 'Full-Back':
      return { pace: 88, shooting: 32, passing: 70, dribbling: 70, defending: 80, physical: 80 };
    case 'Defensive Midfielder':
      return { pace: 72, shooting: 38, passing: 86, dribbling: 58, defending: 84, physical: 82 };
    case 'Centre Midfielder':
      return { pace: 82, shooting: 52, passing: 88, dribbling: 70, defending: 70, physical: 58 };
    case 'Attacking Midfielder':
      return { pace: 90, shooting: 85, passing: 65, dribbling: 85, defending: 35, physical: 60 };
    case 'Winger':
      return { pace: 92, shooting: 78, passing: 60, dribbling: 90, defending: 35, physical: 65 };
    case 'Striker':
      return { pace: 88, shooting: 92, passing: 54, dribbling: 78, defending: 35, physical: 73 };
    default:
      return { pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70 };
  }
}

export function getDefaultBuild(): PlayerBuild {
  return {
    name: 'Your Player',
    nationality: 'England',
    age: 19,
    height: 182,
    weight: 74,
    preferredFoot: 'Right',
    position: 'Attacking Midfielder',
    attributes: getDefaultAttributes('Attacking Midfielder'),
    clubId: 'ars',
  };
}

export function getPositionGroup(position: PlayerPosition): PositionGroup {
  return POSITION_OPTIONS.find((option) => option.value === getPlayerPositionLabel(position))?.group ?? 'central_midfielder';
}

export function getPlayerPositionLabel(position: PlayerPosition | string): PlayerPosition {
  const legacyLabels: Record<string, PlayerPosition> = {
    CB: 'Centre-Back',
    'FB/WB': 'Full-Back',
    DM: 'Defensive Midfielder',
    CM: 'Centre Midfielder',
    AM: 'Attacking Midfielder',
  };
  return legacyLabels[position] ??
    POSITION_OPTIONS.find((option) => option.value === position)?.value ??
    'Centre Midfielder';
}

function hashCode(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function createSeededRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function calculateAttributeAverage(attributes: AttributeSet): number {
  return ATTRIBUTE_LABELS.reduce((sum, key) => sum + attributes[key], 0) / ATTRIBUTE_LABELS.length;
}

function simulateFixture(home: TeamRating, away: TeamRating, random: () => number): { homeGoals: number; awayGoals: number } {
  const tacticalEdge = home.simulation_modifiers.attacking_threat - away.simulation_modifiers.defensive_stability;
  const expectedHome = 1.35 + (home.overall - away.overall) / 28 + tacticalEdge / 90 + (random() - 0.5) * 1.4;
  const expectedAway = 1.1 + (away.overall - home.overall) / 32 + (away.simulation_modifiers.attacking_threat - home.simulation_modifiers.defensive_stability) / 90 + (random() - 0.5) * 1.3;

  const homeGoals = Math.max(0, Math.round(Math.max(0, expectedHome + (random() - 0.5) * 1.5)));
  const awayGoals = Math.max(0, Math.round(Math.max(0, expectedAway + (random() - 0.5) * 1.2)));

  return { homeGoals, awayGoals };
}

function createFixtures(): Array<Array<{ home: TeamRating; away: TeamRating }>> {
  const teams = [...CLUBS];
  const firstHalf: Array<Array<{ home: TeamRating; away: TeamRating }>> = [];

  for (let round = 0; round < teams.length - 1; round += 1) {
    const fixtures: Array<{ home: TeamRating; away: TeamRating }> = [];
    for (let index = 0; index < teams.length / 2; index += 1) {
      const first = teams[index];
      const second = teams[teams.length - 1 - index];
      const swapHomeAway = (round + index) % 2 === 1;
      fixtures.push(swapHomeAway ? { home: second, away: first } : { home: first, away: second });
    }
    firstHalf.push(fixtures);
    teams.splice(1, 0, teams.pop()!);
  }

  const secondHalf = firstHalf.map((fixtures) =>
    fixtures.map(({ home, away }) => ({ home: away, away: home })),
  );
  return [...firstHalf, ...secondHalf];
}

function sortTable(table: LeagueTableEntry[]): LeagueTableEntry[] {
  return [...table]
    .map((entry) => ({ ...entry, goalDifference: entry.goalsFor - entry.goalsAgainst }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
}

function getGoalRate(position: PositionGroup, attributes: AttributeSet): number {
  const positionRate: Record<PositionGroup, number> = {
    goalkeeper: 0,
    centre_back: 0.025,
    full_back_wing_back: 0.065,
    defensive_midfielder: 0.055,
    central_midfielder: 0.1,
    attacking_midfielder: 0.17,
    winger: 0.22,
    striker: 0.32,
  };
  return positionRate[position] * (0.65 + attributes.shooting / 100) * (0.8 + attributes.pace / 500);
}

function getAssistRate(position: PositionGroup, attributes: AttributeSet): number {
  const positionRate: Record<PositionGroup, number> = {
    goalkeeper: 0.005,
    centre_back: 0.012,
    full_back_wing_back: 0.12,
    defensive_midfielder: 0.1,
    central_midfielder: 0.16,
    attacking_midfielder: 0.23,
    winger: 0.19,
    striker: 0.09,
  };
  return positionRate[position] * (0.6 + attributes.passing / 100) * (0.8 + attributes.dribbling / 500);
}

export function simulatePlayerOfTheSeason(build: PlayerBuild, seasonSeed = Date.now()): PlayerSeasonSummary {
  const goldenBootRandom = createSeededRandom(hashCode(`golden-boot-${seasonSeed}`));
  const goldenBootTarget =
    GOLDEN_BOOT_GOAL_TOTALS[Math.floor(goldenBootRandom() * GOLDEN_BOOT_GOAL_TOTALS.length)];
  const goldenPlaymakerRandom = createSeededRandom(hashCode(`golden-playmaker-${seasonSeed}`));
  const goldenPlaymakerTarget =
    GOLDEN_PLAYMAKER_ASSIST_TOTALS[
      Math.floor(goldenPlaymakerRandom() * GOLDEN_PLAYMAKER_ASSIST_TOTALS.length)
    ];
  const club = CLUBS.find((team) => team.id === build.clubId) ?? CLUBS[0];
  const positionGroup = getPositionGroup(build.position);
  const clubStrength = club.position_strengths[positionGroup];
  const averageRating = calculateAttributeAverage(build.attributes);
  const competitionPenalty = {
    Low: 4,
    Medium: 10,
    High: 16,
  }[club.competition_for_places];

  const roleWeight = {
    goalkeeper: 0.8,
    centre_back: 0.82,
    full_back_wing_back: 0.88,
    defensive_midfielder: 0.9,
    central_midfielder: 0.96,
    attacking_midfielder: 1.06,
    winger: 1.12,
    striker: 1.18,
  }[positionGroup];

  const selectionScore = clamp(
    42 + averageRating * roleWeight + (clubStrength - 75) * 0.7 - competitionPenalty + (build.age <= 21 ? 8 : 0),
    18,
    92,
  );

  const startChance = clamp(selectionScore / 100, 0.18, 0.86);
  const appearanceChance = clamp(startChance + 0.08, 0.2, 0.92);
  const goalRate = getGoalRate(positionGroup, build.attributes);
  const assistRate = getAssistRate(positionGroup, build.attributes);
  const table = CLUBS.map((team) => ({
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  }));
  const tableByTeamId = new Map(table.map((entry) => [entry.team.id, entry]));
  const results: PlayerMatchResult[] = [];
  let appearances = 0;
  let minutes = 0;
  let goals = 0;
  let assists = 0;
  let ratingTotal = 0;

  createFixtures().forEach((roundFixtures, roundIndex) => {
    roundFixtures.forEach(({ home, away }, fixtureIndex) => {
      const random = createSeededRandom(hashCode(`${seasonSeed}-${roundIndex}-${fixtureIndex}-${home.id}-${away.id}`));
      const score = simulateFixture(home, away, random);
      const playerClubIsHome = home.id === club.id;
      const playerIsInFixture = playerClubIsHome || away.id === club.id;
      let playerPlayed = false;
      let playerMinutes = 0;
      let playerGoals = 0;
      let playerAssists = 0;
      let playerRating: number | null = null;

      if (playerIsInFixture && random() < appearanceChance) {
        playerPlayed = true;
        const starts = random() < startChance;
        playerMinutes = starts ? 65 + Math.floor(random() * 26) : 15 + Math.floor(random() * 26);
        const minutesFactor = playerMinutes / 90;
        const teamGoalsBeforePlayer = playerClubIsHome ? score.homeGoals : score.awayGoals;

        if (random() < goalRate * minutesFactor) {
          playerGoals = 1;
          if (random() < goalRate * minutesFactor * 0.14) playerGoals += 1;
          playerGoals = Math.min(playerGoals, 2);
        }

        if (random() < assistRate * minutesFactor) {
          playerAssists = 1;
          if (random() < assistRate * minutesFactor * 0.12) playerAssists += 1;
        }

        if (playerGoals > teamGoalsBeforePlayer) {
          if (playerClubIsHome) score.homeGoals = playerGoals;
          else score.awayGoals = playerGoals;
        }
        playerAssists = Math.min(playerAssists, Math.max(0, Math.max(teamGoalsBeforePlayer, playerGoals) - playerGoals));

        playerRating = clamp(
          6.45 + (averageRating - 65) / 30 + (starts ? 0.2 : -0.1) + playerGoals * 0.8 + playerAssists * 0.55 + (random() - 0.5) * 1.2,
          5.2,
          10,
        );
        appearances += 1;
        minutes += playerMinutes;
        goals += playerGoals;
        assists += playerAssists;
        ratingTotal += playerRating;
      }

      results.push({
        round: roundIndex + 1,
        home,
        away,
        homeGoals: score.homeGoals,
        awayGoals: score.awayGoals,
        playerPlayed,
        playerMinutes,
        playerGoals,
        playerAssists,
        playerRating,
      });

      const homeEntry = tableByTeamId.get(home.id)!;
      const awayEntry = tableByTeamId.get(away.id)!;
      homeEntry.played += 1;
      awayEntry.played += 1;
      homeEntry.goalsFor += score.homeGoals;
      homeEntry.goalsAgainst += score.awayGoals;
      awayEntry.goalsFor += score.awayGoals;
      awayEntry.goalsAgainst += score.homeGoals;

      if (score.homeGoals > score.awayGoals) {
        homeEntry.wins += 1;
        awayEntry.losses += 1;
        homeEntry.points += 3;
      } else if (score.awayGoals > score.homeGoals) {
        awayEntry.wins += 1;
        homeEntry.losses += 1;
        awayEntry.points += 3;
      } else {
        homeEntry.draws += 1;
        awayEntry.draws += 1;
        homeEntry.points += 1;
        awayEntry.points += 1;
      }
    });
  });

  const finalTable = sortTable(table);
  const tablePosition = finalTable.findIndex((entry) => entry.team.id === club.id) + 1;
  const averageRatingValue = appearances ? clamp(ratingTotal / appearances, 5.2, 10) : 0;
  const awards: string[] = [];

  if (
    appearances >= 25 &&
    averageRatingValue >= 7.2 &&
    (goals >= 20 || (goals >= 15 && assists >= 10) || assists >= 15 || tablePosition <= 3)
  ) {
    awards.push('Player of the Season');
  }
  if (goals >= goldenBootTarget) awards.push('Golden Boot');
  if (assists >= goldenPlaymakerTarget) awards.push('Golden Playmaker');
  const summaryLabel = getSeasonSummaryLabel(
    {
      appearances,
      minutes,
      goals,
      assists,
      averageRating: averageRatingValue,
      awards,
    },
    build.age,
  );
  const awardsText = awards.length ? awards.join(', ') : 'No major awards';

  const shareText =[
    `${build.name} - ${summaryLabel}`,
    `${club.name} | ${build.position} | ${build.age} | ${build.nationality}`,
    `Apps: ${appearances} | Goals: ${goals} | Assists: ${assists} | Minutes: ${minutes}`,
    `Season finish: ${tablePosition}${tablePosition === 1 ? 'st' : tablePosition === 2 ? 'nd' : tablePosition === 3 ? 'rd' : 'th'} in the Premier League`,
    `Golden Boot target: ${goldenBootTarget} goals | Golden Playmaker target: ${goldenPlaymakerTarget} assists`,
    `Awards: ${awardsText}`,
    'https://footle.club/player-of-the-season',
  ].join('\n');

  return {
    club,
    table: finalTable,
    summaryLabel,
    awards,
    appearances,
    minutes,
    goals,
    assists,
    goldenBootTarget,
    goldenPlaymakerTarget,
    averageRating: Number(averageRatingValue.toFixed(2)),
    ratingText: `${averageRatingValue.toFixed(2)}/10 match rating`,
    shareText,
    tablePosition,
    results,
  };
}
