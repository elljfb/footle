import { players } from '../data/players';
import { Player } from '../types/player';
import { LEAGUE_OPTIONS } from './leagues';
import { getDaySeed, shuffleWithSeed } from './newModes';

const TOP_FIVE_LEAGUES = new Set(LEAGUE_OPTIONS.map((league) => league.name));
const GRID_PLAYERS = players.filter((player) => TOP_FIVE_LEAGUES.has(player.league));
const MIN_PLAYERS_PER_CLUE = 8;
const GRID_SIZE = 3;

export type FootballGridClueKind = 'club' | 'league' | 'nationality';

export interface FootballGridClue {
  kind: FootballGridClueKind;
  value: string;
}

export interface FootballGridCell {
  index: number;
  rowIndex: number;
  columnIndex: number;
  rowClue: FootballGridClue;
  columnClue: FootballGridClue;
  answerIds: number[];
}

export interface FootballGridChallenge {
  id: string;
  rows: FootballGridClue[];
  columns: FootballGridClue[];
  cells: FootballGridCell[];
  playerNames: string[];
}

const KIND_PATTERNS: Array<{ rows: FootballGridClueKind[]; columns: FootballGridClueKind[] }> = [
  { rows: ['nationality', 'nationality', 'nationality'], columns: ['club', 'club', 'club'] },
  { rows: ['club', 'club', 'club'], columns: ['nationality', 'nationality', 'nationality'] },
  { rows: ['nationality', 'nationality', 'nationality'], columns: ['league', 'league', 'league'] },
  { rows: ['league', 'league', 'league'], columns: ['nationality', 'nationality', 'nationality'] },
  { rows: ['nationality', 'nationality', 'nationality'], columns: ['club', 'league', 'league'] },
  { rows: ['club', 'league', 'league'], columns: ['nationality', 'nationality', 'nationality'] },
  { rows: ['nationality', 'nationality', 'league'], columns: ['club', 'club', 'club'] },
  { rows: ['club', 'club', 'club'], columns: ['nationality', 'nationality', 'league'] },
];

function playerMatchesClue(player: Player, clue: FootballGridClue): boolean {
  if (clue.kind === 'club') {
    return player.club === clue.value;
  }

  if (clue.kind === 'league') {
    return player.league === clue.value;
  }

  return player.nationality === clue.value;
}

function getValuesByKind(): Record<FootballGridClueKind, string[]> {
  const valuesByKind: Record<FootballGridClueKind, Map<string, number>> = {
    club: new Map(),
    league: new Map(),
    nationality: new Map(),
  };

  for (const player of GRID_PLAYERS) {
    valuesByKind.club.set(player.club, (valuesByKind.club.get(player.club) ?? 0) + 1);
    valuesByKind.league.set(player.league, (valuesByKind.league.get(player.league) ?? 0) + 1);
    valuesByKind.nationality.set(player.nationality, (valuesByKind.nationality.get(player.nationality) ?? 0) + 1);
  }

  return {
    club: [...valuesByKind.club.entries()]
      .filter(([, count]) => count >= MIN_PLAYERS_PER_CLUE)
      .map(([value]) => value)
      .sort((a, b) => a.localeCompare(b)),
    league: LEAGUE_OPTIONS.map((league) => league.name),
    nationality: [...valuesByKind.nationality.entries()]
      .filter(([, count]) => count >= MIN_PLAYERS_PER_CLUE)
      .map(([value]) => value)
      .sort((a, b) => a.localeCompare(b)),
  };
}

function pickClues(
  kinds: FootballGridClueKind[],
  valuesByKind: Record<FootballGridClueKind, string[]>,
  seed: number
): FootballGridClue[] {
  const used = new Set<string>();

  return kinds.map((kind, index) => {
    const values = shuffleWithSeed(valuesByKind[kind], seed + index * 101);
    const value = values.find((candidate) => !used.has(`${kind}:${candidate}`)) ?? values[0];
    used.add(`${kind}:${value}`);

    return { kind, value };
  });
}

function pickColumnsForRows(
  kinds: FootballGridClueKind[],
  rows: FootballGridClue[],
  valuesByKind: Record<FootballGridClueKind, string[]>,
  seed: number
): FootballGridClue[] | null {
  const columns: FootballGridClue[] = [];
  const used = new Set(rows.map((row) => `${row.kind}:${row.value}`));

  for (let index = 0; index < kinds.length; index++) {
    const kind = kinds[index];
    const values = shuffleWithSeed(valuesByKind[kind], seed + index * 103);
    const value = values.find((candidate) => {
      if (used.has(`${kind}:${candidate}`)) {
        return false;
      }

      const column = { kind, value: candidate };
      return rows.every((row) => getAnswerIds(row, column).length > 0);
    });

    if (!value) {
      return null;
    }

    used.add(`${kind}:${value}`);
    columns.push({ kind, value });
  }

  return columns;
}

function getAnswerIds(rowClue: FootballGridClue, columnClue: FootballGridClue): number[] {
  return GRID_PLAYERS
    .filter((player) => playerMatchesClue(player, rowClue) && playerMatchesClue(player, columnClue))
    .map((player) => player.id);
}

function buildCells(rows: FootballGridClue[], columns: FootballGridClue[]): FootballGridCell[] {
  return rows.flatMap((row, rowIndex) =>
    columns.map((column, columnIndex) => ({
      index: rowIndex * GRID_SIZE + columnIndex,
      rowIndex,
      columnIndex,
      rowClue: row,
      columnClue: column,
      answerIds: getAnswerIds(row, column),
    }))
  );
}

function hasUniquePlayerSolution(cells: FootballGridCell[]): boolean {
  const orderedCells = [...cells].sort((a, b) => a.answerIds.length - b.answerIds.length);
  const usedPlayerIds = new Set<number>();

  const solve = (cellIndex: number): boolean => {
    if (cellIndex >= orderedCells.length) {
      return true;
    }

    for (const playerId of orderedCells[cellIndex].answerIds) {
      if (usedPlayerIds.has(playerId)) {
        continue;
      }

      usedPlayerIds.add(playerId);

      if (solve(cellIndex + 1)) {
        return true;
      }

      usedPlayerIds.delete(playerId);
    }

    return false;
  };

  return orderedCells.every((cell) => cell.answerIds.length > 0) && solve(0);
}

function buildChallenge(rows: FootballGridClue[], columns: FootballGridClue[], seed: number): FootballGridChallenge {
  const cells = buildCells(rows, columns);
  return {
    id: `${seed}:${rows.map((row) => `${row.kind}:${row.value}`).join('|')}:${columns.map((column) => `${column.kind}:${column.value}`).join('|')}`,
    rows,
    columns,
    cells,
    playerNames: GRID_PLAYERS.map((player) => player.name),
  };
}

export function getDailyFootballGridChallenge(referenceDate?: Date): FootballGridChallenge {
  const seed = getDaySeed(referenceDate);
  const valuesByKind = getValuesByKind();
  const shuffledPatterns = shuffleWithSeed(KIND_PATTERNS, seed * 29 + 7);

  for (let attempt = 0; attempt < 1200; attempt++) {
    const pattern = shuffledPatterns[attempt % shuffledPatterns.length];
    const rows = pickClues(pattern.rows, valuesByKind, seed * 97 + attempt * 17);
    const columns = pickColumnsForRows(pattern.columns, rows, valuesByKind, seed * 131 + attempt * 19);

    if (!columns) {
      continue;
    }

    const challenge = buildChallenge(rows, columns, seed);

    if (hasUniquePlayerSolution(challenge.cells)) {
      return challenge;
    }
  }

  const fallbackRows = [
    { kind: 'nationality' as const, value: 'Argentina' },
    { kind: 'nationality' as const, value: 'Brazil' },
    { kind: 'nationality' as const, value: 'France' },
  ];
  const fallbackColumns = [
    { kind: 'league' as const, value: 'Premier League' },
    { kind: 'league' as const, value: 'LaLiga' },
    { kind: 'league' as const, value: 'Serie A' },
  ];

  return buildChallenge(fallbackRows, fallbackColumns, seed);
}

export function findFootballGridPlayer(playerName: string): Player | null {
  const normalizedGuess = playerName.trim().toLowerCase();
  if (!normalizedGuess) {
    return null;
  }

  return GRID_PLAYERS.find((player) => player.name.toLowerCase() === normalizedGuess) ?? null;
}

export function isPlayerValidForFootballGridCell(player: Player, cell: FootballGridCell): boolean {
  return playerMatchesClue(player, cell.rowClue) && playerMatchesClue(player, cell.columnClue);
}
