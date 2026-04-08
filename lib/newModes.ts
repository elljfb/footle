import { players } from '../data/players';
import { Foot, Player, Position, SubPosition } from '../types/player';

const DAY_MS = 1000 * 60 * 60 * 24;

const POSITION_SHORT_NAMES: Record<Position, string> = {
  Goalkeeper: 'GK',
  Defender: 'DEF',
  Midfielder: 'MID',
  Forward: 'FWD',
};

const SUB_POSITION_SHORT_NAMES: Record<SubPosition, string> = {
  Goalkeeper: 'GK',
  'Right-Back': 'RB',
  'Centre-Back': 'CB',
  'Left-Back': 'LB',
  'Defensive Midfielder': 'DM',
  'Central Midfielder': 'CM',
  'Right Midfielder': 'RM',
  'Left Midfielder': 'LM',
  'Attacking Midfielder': 'AM',
  'Right Winger': 'RW',
  'Left Winger': 'LW',
  Striker: 'ST',
};

const NATIONALITY_FLAG_CODES: Record<string, string> = {
  Albania: 'AL',
  Algeria: 'DZ',
  Angola: 'AO',
  Argentina: 'AR',
  Armenia: 'AM',
  Australia: 'AU',
  Austria: 'AT',
  Belgium: 'BE',
  Benin: 'BJ',
  'Bosnia-Herzegovina': 'BA',
  Brazil: 'BR',
  Bulgaria: 'BG',
  'Burkina Faso': 'BF',
  Burundi: 'BI',
  Cameroon: 'CM',
  Canada: 'CA',
  'Cape Verde': 'CV',
  'Central African Republic': 'CF',
  Chile: 'CL',
  Colombia: 'CO',
  Comoros: 'KM',
  'Cote dIvoire': 'CI',
  Croatia: 'HR',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  Denmark: 'DK',
  'Dominican Republic': 'DO',
  'DR Congo': 'CD',
  Ecuador: 'EC',
  Egypt: 'EG',
  England: 'GB',
  'Equatorial Guinea': 'GQ',
  Estonia: 'EE',
  'Faroe Islands': 'FO',
  Finland: 'FI',
  France: 'FR',
  'French Guiana': 'GF',
  Gabon: 'GA',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Greece: 'GR',
  Guadeloupe: 'GP',
  Guinea: 'GN',
  'Guinea-Bissau': 'GW',
  Haiti: 'HT',
  Honduras: 'HN',
  Hungary: 'HU',
  Iceland: 'IS',
  Indonesia: 'ID',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jordan: 'JO',
  'Korea, South': 'KR',
  Kosovo: 'XK',
  Libya: 'LY',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Malaysia: 'MY',
  Mali: 'ML',
  Mauritania: 'MR',
  Mexico: 'MX',
  Moldova: 'MD',
  Montenegro: 'ME',
  Morocco: 'MA',
  Mozambique: 'MZ',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Niger: 'NE',
  Nigeria: 'NG',
  'North Macedonia': 'MK',
  'Northern Ireland': 'GB',
  Norway: 'NO',
  Panama: 'PA',
  Paraguay: 'PY',
  Peru: 'PE',
  Poland: 'PL',
  Portugal: 'PT',
  Romania: 'RO',
  Russia: 'RU',
  'Saudi Arabia': 'SA',
  Scotland: 'GB',
  Senegal: 'SN',
  Serbia: 'RS',
  'Sierra Leone': 'SL',
  Slovakia: 'SK',
  Slovenia: 'SI',
  'South Africa': 'ZA',
  Spain: 'ES',
  Suriname: 'SR',
  Sweden: 'SE',
  Switzerland: 'CH',
  Syria: 'SY',
  Tanzania: 'TZ',
  'The Gambia': 'GM',
  Togo: 'TG',
  'Trinidad and Tobago': 'TT',
  Tunisia: 'TN',
  Turkiye: 'TR',
  Ukraine: 'UA',
  'United States': 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Venezuela: 'VE',
  Wales: 'GB',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
};

const NATIONALITY_FLAG_ICON_OVERRIDES: Record<string, string> = {
  England: 'GB_ENG',
  Scotland: 'GB_SCT',
  Wales: 'GB_WLS',
  'Northern Ireland': 'GB_NIR',
};

const CLUB_ALIAS_MAP: Record<string, string> = {
  'manchester city': 'man city',
  'man city': 'man city',
  'nottingham forest': 'nottm forest',
  'nottm forest': 'nottm forest',
  psg: 'psg',
  'paris saint germain': 'psg',
  'paris sg': 'psg',
  'borussia monchengladbach': 'monchengladbach',
  'borussia moenchengladbach': 'monchengladbach',
  'monchengladbach': 'monchengladbach',
  'ac milan': 'ac milan',
  milan: 'ac milan',
  'inter milan': 'inter',
  inter: 'inter',
  'fc nantes': 'fc nantes',
  nantes: 'fc nantes',
  'stade rennais': 'stade rennais',
  rennes: 'stade rennais',
  'ca osasuna': 'ca osasuna',
  osasuna: 'ca osasuna',
  'rcd mallorca': 'rcd mallorca',
  mallorca: 'rcd mallorca',
  'athletic club': 'athletic club',
  'athletic bilbao': 'athletic club',
  'sevilla fc': 'sevilla fc',
  sevilla: 'sevilla fc',
  'fc lorient': 'fc lorient',
  lorient: 'fc lorient',
  'fc metz': 'fc metz',
  metz: 'fc metz',
  'real betis': 'real betis',
  'real sociedad': 'real sociedad',
  'real madrid': 'real madrid',
  'atletico': 'atletico madrid',
  'atletico madrid': 'atletico madrid',
  'bournemouth': 'bournemouth',
  'crystal palace': 'crystal palace',
  'brighton': 'brighton',
  'newcastle': 'newcastle',
  'west ham': 'west ham',
  'aston villa': 'aston villa',
  'tottenham': 'tottenham',
  'leipzig': 'leipzig',
  dortmund: 'dortmund',
  wolfsburg: 'wolfsburg',
  hamburg: 'hamburg',
  bremen: 'werder bremen',
  'werder bremen': 'werder bremen',
  'union berlin': 'union berlin',
  hoffenheim: 'hoffenheim',
  heidenheim: 'heidenheim',
  augsburg: 'augsburg',
  'mgladbach': 'monchengladbach',
};

export interface SquadBlueprintSlot {
  playerId: number;
  name: string;
  nationality: string;
  age: number;
  position: Position;
  subPosition: SubPosition;
  formationCellId: SquadFormationCellId;
}

export interface SquadBlueprintChallenge {
  club: string;
  clubLeague: string;
  slots: SquadBlueprintSlot[];
  clubOptions: string[];
}

export type FilterRuleKind =
  | 'age_gt'
  | 'age_lt'
  | 'height_gt'
  | 'height_lt'
  | 'league_is'
  | 'league_not'
  | 'position_is'
  | 'position_not'
  | 'subPosition_is'
  | 'subPosition_not'
  | 'nationality_is'
  | 'nationality_not'
  | 'foot_is'
  | 'foot_not';

export interface FilterRule {
  id: string;
  kind: FilterRuleKind;
  value: string | number;
  text: string;
}

export interface FilterHuntChallenge {
  cards: Player[];
  targetPlayerId: number;
  instructions: FilterRule[];
}

export const SQUAD_BLUEPRINT_STARTING_CLUE_COUNT = 6;
export const SQUAD_BLUEPRINT_TOTAL_CLUE_COUNT = 11;

export const SQUAD_FORMATION_CELL_ORDER = [
  'gk',
  'lb',
  'lcb',
  'rcb',
  'rb',
  'lcm',
  'cm',
  'rcm',
  'lw',
  'st',
  'rw',
] as const;

export type SquadFormationCellId = (typeof SQUAD_FORMATION_CELL_ORDER)[number];

const SUB_POSITION_CELL_PREFERENCES: Record<SubPosition, SquadFormationCellId[]> = {
  Goalkeeper: ['gk'],
  'Right-Back': ['rb', 'rcb'],
  'Centre-Back': ['lcb', 'rcb', 'lb', 'rb'],
  'Left-Back': ['lb', 'lcb'],
  'Defensive Midfielder': ['cm', 'lcm', 'rcm'],
  'Central Midfielder': ['lcm', 'rcm', 'cm'],
  'Right Midfielder': ['rw', 'rcm', 'rb'],
  'Left Midfielder': ['lw', 'lcm', 'lb'],
  'Attacking Midfielder': ['cm', 'lcm', 'rcm', 'st'],
  'Right Winger': ['rw', 'st'],
  'Left Winger': ['lw', 'st'],
  Striker: ['st', 'lw', 'rw'],
};

const POSITION_CELL_FALLBACKS: Record<Position, SquadFormationCellId[]> = {
  Goalkeeper: ['gk'],
  Defender: ['lb', 'lcb', 'rcb', 'rb'],
  Midfielder: ['lcm', 'cm', 'rcm'],
  Forward: ['lw', 'st', 'rw'],
};

const FORMATION_CELL_SUBPOSITION_SCORES: Record<
  SquadFormationCellId,
  Partial<Record<SubPosition, number>>
> = {
  gk: {
    Goalkeeper: 100,
  },
  lb: {
    'Left-Back': 100,
    'Centre-Back': 70,
    'Left Midfielder': 55,
  },
  lcb: {
    'Centre-Back': 100,
    'Left-Back': 70,
  },
  rcb: {
    'Centre-Back': 100,
    'Right-Back': 70,
  },
  rb: {
    'Right-Back': 100,
    'Centre-Back': 70,
    'Right Midfielder': 55,
  },
  lcm: {
    'Central Midfielder': 100,
    'Defensive Midfielder': 88,
    'Attacking Midfielder': 82,
    'Left Midfielder': 78,
  },
  cm: {
    'Central Midfielder': 100,
    'Defensive Midfielder': 92,
    'Attacking Midfielder': 90,
  },
  rcm: {
    'Central Midfielder': 100,
    'Defensive Midfielder': 88,
    'Attacking Midfielder': 82,
    'Right Midfielder': 78,
  },
  lw: {
    'Left Winger': 100,
    'Left Midfielder': 84,
    Striker: 68,
    'Attacking Midfielder': 62,
  },
  st: {
    Striker: 100,
    'Attacking Midfielder': 70,
    'Left Winger': 58,
    'Right Winger': 58,
  },
  rw: {
    'Right Winger': 100,
    'Right Midfielder': 84,
    Striker: 68,
    'Attacking Midfielder': 62,
  },
};

function getReferenceDate(referenceDate?: Date): Date {
  return referenceDate ? new Date(referenceDate) : new Date();
}

export function calculateAge(dateOfBirth: string, referenceDate?: Date): number {
  const today = getReferenceDate(referenceDate);
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function getDaySeed(referenceDate?: Date): number {
  const date = getReferenceDate(referenceDate);
  return Math.floor(date.getTime() / DAY_MS);
}

export function createSeededRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const random = createSeededRandom(seed);
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function getUniqueClubs(): string[] {
  return [...new Set(players.map((player) => player.club))].sort((a, b) => a.localeCompare(b));
}

export function getClubOptions(): string[] {
  return getUniqueClubs();
}

export function getSubPositionShortName(subPosition: SubPosition): string {
  return SUB_POSITION_SHORT_NAMES[subPosition];
}

export function getPositionShortName(position: Position): string {
  return POSITION_SHORT_NAMES[position];
}

function toEmojiFlag(code: string): string {
  if (code.length !== 2) {
    return '🏳️';
  }

  const A = 0x1f1e6;
  const first = code.toUpperCase().charCodeAt(0) - 65 + A;
  const second = code.toUpperCase().charCodeAt(1) - 65 + A;
  return String.fromCodePoint(first, second);
}

export function getNationalityFlag(nationality: string): string {
  const code = NATIONALITY_FLAG_CODES[nationality];
  return code ? toEmojiFlag(code) : '🏳️';
}

export function getNationalityFlagIconCode(nationality: string): string | null {
  const override = NATIONALITY_FLAG_ICON_OVERRIDES[nationality];
  if (override) {
    return override;
  }

  const code = NATIONALITY_FLAG_CODES[nationality];
  if (!code) {
    return null;
  }

  return code.replace(/-/g, '_');
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.'’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(fc|cf|sc|ac|rcd|ca)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalClubName(value: string): string {
  const normalized = normalizeText(value);
  return CLUB_ALIAS_MAP[normalized] ?? normalized;
}

export function normalizeClubGuess(value: string): string {
  return canonicalClubName(value);
}

export function isKnownClubGuess(value: string): boolean {
  const normalizedGuess = canonicalClubName(value);
  return getUniqueClubs().some((club) => canonicalClubName(club) === normalizedGuess);
}

export function compareClubGuess(
  guess: string,
  targetClub: string,
  targetLeague: string
): 'correct' | 'close' | 'incorrect' {
  const normalizedGuess = canonicalClubName(guess);
  const normalizedTarget = canonicalClubName(targetClub);

  if (normalizedGuess === normalizedTarget) {
    return 'correct';
  }

  const guessedClub = players.find((player) => canonicalClubName(player.club) === normalizedGuess);
  if (guessedClub && guessedClub.league === targetLeague) {
    return 'close';
  }

  return 'incorrect';
}

function buildSquadSlot(
  player: Player,
  formationCellId: SquadFormationCellId,
  referenceDate?: Date
): SquadBlueprintSlot {
  return {
    playerId: player.id,
    name: player.name,
    nationality: player.nationality,
    age: calculateAge(player.dateOfBirth, referenceDate),
    position: player.position,
    subPosition: player.subPosition,
    formationCellId,
  };
}

function scorePlayer(player: Player, seed: number): number {
  const random = createSeededRandom(seed + player.id * 97);
  const positionWeight: Record<Position, number> = {
    Goalkeeper: 1.2,
    Defender: 1.6,
    Midfielder: 2,
    Forward: 2.2,
  };

  const age = calculateAge(player.dateOfBirth);
  return (
    positionWeight[player.position] * 100 +
    (30 - Math.abs(age - 26)) * 4 +
    player.height * 0.3 +
    random() * 10
  );
}

function getFormationCellFitScore(player: Player, formationCellId: SquadFormationCellId): number {
  const subPositionScore = FORMATION_CELL_SUBPOSITION_SCORES[formationCellId][player.subPosition];
  if (subPositionScore) {
    return subPositionScore;
  }

  const fallbackCells = POSITION_CELL_FALLBACKS[player.position] ?? [];
  if (fallbackCells.includes(formationCellId)) {
    return 35;
  }

  return 0;
}

function buildBlueprintLineup(clubPlayers: Player[], seed: number, referenceDate?: Date): SquadBlueprintSlot[] {
  const shuffledPlayers = shuffleWithSeed(clubPlayers, seed);
  const candidatesByCell = SQUAD_FORMATION_CELL_ORDER.map((formationCellId, index) => {
    const candidates = shuffledPlayers
      .map((player) => {
        const fitScore = getFormationCellFitScore(player, formationCellId);
        if (fitScore <= 0) {
          return null;
        }

        return {
          player,
          totalScore: fitScore * 1000 + scorePlayer(player, seed + index * 29),
        };
      })
      .filter((candidate): candidate is { player: Player; totalScore: number } => candidate !== null)
      .sort((a, b) => b.totalScore - a.totalScore);

    return {
      formationCellId,
      candidates,
    };
  }).sort((a, b) => a.candidates.length - b.candidates.length);

  if (candidatesByCell.some((entry) => entry.candidates.length === 0)) {
    return [];
  }

  const assignments = new Map<SquadFormationCellId, Player>();
  const usedPlayerIds = new Set<number>();

  const assignNextCell = (cellIndex: number): boolean => {
    if (cellIndex >= candidatesByCell.length) {
      return true;
    }

    const { formationCellId, candidates } = candidatesByCell[cellIndex];

    for (const candidate of candidates) {
      if (usedPlayerIds.has(candidate.player.id)) {
        continue;
      }

      usedPlayerIds.add(candidate.player.id);
      assignments.set(formationCellId, candidate.player);

      if (assignNextCell(cellIndex + 1)) {
        return true;
      }

      assignments.delete(formationCellId);
      usedPlayerIds.delete(candidate.player.id);
    }

    return false;
  };

  if (!assignNextCell(0)) {
    return [];
  }

  return SQUAD_FORMATION_CELL_ORDER.map((formationCellId) => {
    const player = assignments.get(formationCellId);

    if (!player) {
      return null;
    }

    return buildSquadSlot(player, formationCellId, referenceDate);
  }).filter((slot): slot is SquadBlueprintSlot => slot !== null);
}

export function getDailySquadBlueprintChallenge(referenceDate?: Date): SquadBlueprintChallenge {
  const seed = getDaySeed(referenceDate);
  const clubMap = new Map<string, Player[]>();

  for (const player of players) {
    const current = clubMap.get(player.club) ?? [];
    current.push(player);
    clubMap.set(player.club, current);
  }

  const viableClubs = [...clubMap.entries()]
    .filter(([, clubPlayers]) => clubPlayers.length >= SQUAD_BLUEPRINT_TOTAL_CLUE_COUNT)
    .sort(([clubA], [clubB]) => clubA.localeCompare(clubB));

  const shuffledClubs = shuffleWithSeed(viableClubs, seed);

  for (let attempt = 0; attempt < shuffledClubs.length; attempt++) {
    const [club, clubPlayers] = shuffledClubs[(seed + attempt) % shuffledClubs.length];
    const slots = buildBlueprintLineup(clubPlayers, seed + attempt * 13, referenceDate);

    if (slots.length >= SQUAD_BLUEPRINT_TOTAL_CLUE_COUNT) {
      return {
        club,
        clubLeague: clubPlayers[0].league,
        slots,
        clubOptions: getClubOptions(),
      };
    }
  }

  const fallbackClub = [...clubMap.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  const [club, clubPlayers] = fallbackClub;
  const slots = buildBlueprintLineup(clubPlayers, seed, referenceDate);

  return {
    club,
    clubLeague: clubPlayers[0].league,
    slots,
    clubOptions: getClubOptions(),
  };
}

export function getNationalFlagLabel(nationality: string): string {
  return `${getNationalityFlag(nationality)} ${nationality}`;
}

function ruleId(kind: FilterRuleKind, value: string | number): string {
  return `${kind}:${value}`;
}

function ruleText(kind: FilterRuleKind, value: string | number): string {
  switch (kind) {
    case 'age_gt':
      return `Eliminate all players over age ${value}.`;
    case 'age_lt':
      return `Eliminate all players under age ${value}.`;
    case 'height_gt':
      return `Eliminate all players taller than ${value}cm.`;
    case 'height_lt':
      return `Eliminate all players shorter than ${value}cm.`;
    case 'league_is':
      return `Eliminate all players who play in ${value}.`;
    case 'league_not':
      return `Eliminate all players who don't play in ${value}.`;
    case 'position_is':
      return `Eliminate all ${value}s.`;
    case 'position_not':
      return `Eliminate all players who are not ${value}s.`;
    case 'subPosition_is':
      return `Eliminate all players who play as ${value}.`;
    case 'subPosition_not':
      return `Eliminate all players who do not play as ${value}.`;
    case 'nationality_is':
      return `Eliminate all players from ${value}.`;
    case 'nationality_not':
      return `Eliminate all players who are not from ${value}.`;
    case 'foot_is':
      return `Eliminate all ${value}-footed players.`;
    case 'foot_not':
      return `Eliminate all players who are not ${value}-footed.`;
    default:
      return 'Eliminate players.';
  }
}

function matchesRule(player: Player, rule: FilterRule): boolean {
  const age = calculateAge(player.dateOfBirth);
  const foot = player.foot;

  switch (rule.kind) {
    case 'age_gt':
      return age > Number(rule.value);
    case 'age_lt':
      return age < Number(rule.value);
    case 'height_gt':
      return player.height > Number(rule.value);
    case 'height_lt':
      return player.height < Number(rule.value);
    case 'league_is':
      return player.league === rule.value;
    case 'league_not':
      return player.league !== rule.value;
    case 'position_is':
      return player.position === rule.value;
    case 'position_not':
      return player.position !== rule.value;
    case 'subPosition_is':
      return player.subPosition === rule.value;
    case 'subPosition_not':
      return player.subPosition !== rule.value;
    case 'nationality_is':
      return player.nationality === rule.value;
    case 'nationality_not':
      return player.nationality !== rule.value;
    case 'foot_is':
      return foot === rule.value;
    case 'foot_not':
      return foot !== rule.value;
    default:
      return false;
  }
}

function buildRule(kind: FilterRuleKind, value: string | number): FilterRule {
  return {
    id: ruleId(kind, value),
    kind,
    value,
    text: ruleText(kind, value),
  };
}

function getCandidateRules(remaining: Player[], target: Player): FilterRule[] {
  const candidates: FilterRule[] = [];
  const ages = [...new Set(remaining.map((player) => calculateAge(player.dateOfBirth)))].sort((a, b) => a - b);
  const heights = [...new Set(remaining.map((player) => player.height))].sort((a, b) => a - b);
  const leagues = [...new Set(remaining.map((player) => player.league))].sort((a, b) => a.localeCompare(b));
  const positions = [...new Set(remaining.map((player) => player.position))].sort();
  const subPositions = [...new Set(remaining.map((player) => player.subPosition))].sort();
  const nationalities = [...new Set(remaining.map((player) => player.nationality))].sort((a, b) => a.localeCompare(b));
  const feet = [...new Set(remaining.map((player) => player.foot))].sort();

  const targetAge = calculateAge(target.dateOfBirth);

  if (ages.length > 1) {
    candidates.push(buildRule('age_gt', targetAge));
    candidates.push(buildRule('age_lt', targetAge));
  }

  if (heights.length > 1) {
    candidates.push(buildRule('height_gt', target.height));
    candidates.push(buildRule('height_lt', target.height));
  }

  leagues.forEach((league) => {
    if (league === target.league) {
      candidates.push(buildRule('league_not', league));
    } else {
      candidates.push(buildRule('league_is', league));
    }
  });

  positions.forEach((position) => {
    if (position === target.position) {
      candidates.push(buildRule('position_not', position));
    } else {
      candidates.push(buildRule('position_is', position));
    }
  });

  subPositions.forEach((subPosition) => {
    if (subPosition === target.subPosition) {
      candidates.push(buildRule('subPosition_not', subPosition));
    } else {
      candidates.push(buildRule('subPosition_is', subPosition));
    }
  });

  nationalities.forEach((nationality) => {
    if (nationality === target.nationality) {
      candidates.push(buildRule('nationality_not', nationality));
    } else {
      candidates.push(buildRule('nationality_is', nationality));
    }
  });

  feet.forEach((foot) => {
    if (foot === target.foot) {
      candidates.push(buildRule('foot_not', foot));
    } else {
      candidates.push(buildRule('foot_is', foot));
    }
  });

  return candidates.filter((rule, index, self) => self.findIndex((candidate) => candidate.id === rule.id) === index);
}

function buildFilterSequence(
  remaining: Player[],
  target: Player,
  depth: number,
  requiredSteps: number
): FilterRule[] | null {
  if (remaining.length <= 1) {
    return requiredSteps <= 0 ? [] : null;
  }

  if (depth === 0) {
    return null;
  }

  const candidates = getCandidateRules(remaining, target)
    .map((rule) => ({
      rule,
      eliminated: remaining.filter((player) => matchesRule(player, rule)),
    }))
    .filter(({ eliminated }) => eliminated.length > 0 && eliminated.every((player) => player.id !== target.id))
    .sort((a, b) => {
      const idealElimination = Math.max(2, Math.round(remaining.length / Math.max(2, depth + 1)));
      const aDistance = Math.abs(a.eliminated.length - idealElimination);
      const bDistance = Math.abs(b.eliminated.length - idealElimination);
      return aDistance - bDistance || b.eliminated.length - a.eliminated.length;
    });

  for (const candidate of candidates.slice(0, 20)) {
    const nextRemaining = remaining.filter((player) => !matchesRule(player, candidate.rule));
    const nextSequence = buildFilterSequence(nextRemaining, target, depth - 1, Math.max(0, requiredSteps - 1));

    if (nextSequence) {
      return [candidate.rule, ...nextSequence];
    }
  }

  return null;
}

export function getDailyFilterHuntChallenge(referenceDate?: Date): FilterHuntChallenge {
  const seed = getDaySeed(referenceDate);

  for (let attempt = 0; attempt < 80; attempt++) {
    const attemptSeed = seed * 97 + attempt * 17;
    const shuffled = shuffleWithSeed(players, attemptSeed);
    const cards = shuffled.slice(0, 20);
    const targetIndex = attemptSeed % cards.length;
    const targetPlayer = cards[targetIndex];
    const sequence = buildFilterSequence(cards, targetPlayer, 5, 3);

    if (sequence && sequence.length >= 3) {
      return {
        cards,
        targetPlayerId: targetPlayer.id,
        instructions: sequence,
      };
    }
  }

  const fallbackCards = shuffleWithSeed(players, seed).slice(0, 20);
  return {
    cards: fallbackCards,
    targetPlayerId: fallbackCards[0].id,
    instructions: [
      buildRule('nationality_not', fallbackCards[0].nationality),
      buildRule('position_not', fallbackCards[0].position),
      buildRule('league_not', fallbackCards[0].league),
    ],
  };
}

export function evaluateFilterRule(player: Player, rule: FilterRule): boolean {
  return matchesRule(player, rule);
}
