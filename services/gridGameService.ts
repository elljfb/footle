import footballCareersEasy from '../data/footballCareersEasy';
import footballCareersMedium from '../data/footballCareersMedium';
import type { PlayerCareer } from '../types/career';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const MAX_GENERATION_ATTEMPTS = 220;

interface GridPlayer {
  name: string;
  clubs: string[];
}

export interface GridPuzzle {
  rowClubs: [string, string, string];
  columnClubs: [string, string, string];
  validPlayersByCell: string[][][];
  allPlayerNames: string[];
}

export type GridGuessValidationCode = 'valid' | 'unknown_player' | 'duplicate_player' | 'wrong_cell';

interface GridData {
  gridPlayers: GridPlayer[];
  allPlayerNames: string[];
  clubToPlayers: Map<string, Set<string>>;
  pairToPlayers: Map<string, Set<string>>;
  allClubs: string[];
}

const puzzleCache = new Map<number, GridPuzzle>();
let gridDataCache: GridData | null = null;

function getStartYear(years: string): number {
  const match = years.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

function cleanClubName(club: string): string {
  return club
    .replace(/^(?:->|\u2192)\s*/u, '')
    .trim();
}

function isReserveSide(club: string): boolean {
  return (
    /(?:\sB|\sC|\sII|\sIII|\s2|\s3)$/i.test(club) ||
    /\bU(?:19|21|23)\b/i.test(club) ||
    /Castilla/i.test(club)
  );
}

function extractClubs(player: PlayerCareer): string[] {
  const clubs = player.seniorCareer
    .map((spell, index) => ({
      club: cleanClubName(spell.club),
      startYear: getStartYear(spell.years),
      originalIndex: index,
    }))
    .filter((spell) => spell.club && !isReserveSide(spell.club))
    .sort((a, b) => {
      if (a.startYear !== b.startYear) {
        return a.startYear - b.startYear;
      }

      return a.originalIndex - b.originalIndex;
    })
    .map((spell) => spell.club);

  return [...new Set(clubs)];
}

function mergeCareerPools(players: readonly PlayerCareer[]): GridPlayer[] {
  const playersByName = new Map<string, Set<string>>();

  for (const player of players) {
    if (player.error || player.seniorCareer.length === 0) {
      continue;
    }

    const clubs = extractClubs(player);
    if (clubs.length < 2) {
      continue;
    }

    const existing = playersByName.get(player.name) ?? new Set<string>();
    clubs.forEach((club) => existing.add(club));
    playersByName.set(player.name, existing);
  }

  return Array.from(playersByName.entries())
    .map(([name, clubs]) => ({
      name,
      clubs: Array.from(clubs),
    }))
    .filter((player) => player.clubs.length >= 2)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|||');
}

function createRng(seed: number): () => number {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getGridData(): GridData {
  if (gridDataCache) {
    return gridDataCache;
  }

  const gridPlayers = mergeCareerPools([
    ...footballCareersEasy,
    ...footballCareersMedium,
  ]);

  const clubToPlayers = new Map<string, Set<string>>();
  const pairToPlayers = new Map<string, Set<string>>();

  for (const player of gridPlayers) {
    for (const club of player.clubs) {
      const clubPlayers = clubToPlayers.get(club) ?? new Set<string>();
      clubPlayers.add(player.name);
      clubToPlayers.set(club, clubPlayers);
    }

    for (let i = 0; i < player.clubs.length; i += 1) {
      for (let j = i + 1; j < player.clubs.length; j += 1) {
        const key = pairKey(player.clubs[i], player.clubs[j]);
        const pairPlayers = pairToPlayers.get(key) ?? new Set<string>();
        pairPlayers.add(player.name);
        pairToPlayers.set(key, pairPlayers);
      }
    }
  }

  const allClubs = Array.from(clubToPlayers.keys())
    .filter((club) => (clubToPlayers.get(club)?.size ?? 0) >= 2)
    .sort((a, b) => a.localeCompare(b));

  gridDataCache = {
    gridPlayers,
    allPlayerNames: gridPlayers.map((player) => player.name),
    clubToPlayers,
    pairToPlayers,
    allClubs,
  };

  return gridDataCache;
}

function getIntersectionPlayers(data: GridData, rowClub: string, columnClub: string): string[] {
  return Array.from(data.pairToPlayers.get(pairKey(rowClub, columnClub)) ?? []).sort((a, b) =>
    a.localeCompare(b)
  );
}

function hasUniqueAssignment(validPlayersByCell: string[][][]): boolean {
  const cells = validPlayersByCell
    .flatMap((row) => row)
    .sort((a, b) => a.length - b.length);

  const usedPlayers = new Set<string>();

  const assign = (index: number): boolean => {
    if (index === cells.length) {
      return true;
    }

    const players = cells[index];
    const limit = Math.min(players.length, 12);

    for (let i = 0; i < limit; i += 1) {
      const player = players[i];

      if (usedPlayers.has(player)) {
        continue;
      }

      usedPlayers.add(player);
      if (assign(index + 1)) {
        return true;
      }
      usedPlayers.delete(player);
    }

    return false;
  };

  return assign(0);
}

function scoreGrid(validPlayersByCell: string[][][]): number {
  const flatCells = validPlayersByCell.flat();
  const densityScore = flatCells.reduce((total, players) => total + Math.min(players.length, 5), 0);
  const varietyScore = new Set(flatCells.flat()).size;
  return densityScore + varietyScore;
}

function buildPuzzleFromClubs(
  data: GridData,
  rowClubs: [string, string, string],
  columnClubs: [string, string, string]
): GridPuzzle | null {
  const validPlayersByCell = rowClubs.map((rowClub) =>
    columnClubs.map((columnClub) => getIntersectionPlayers(data, rowClub, columnClub))
  );

  if (validPlayersByCell.some((row) => row.some((players) => players.length === 0))) {
    return null;
  }

  if (!hasUniqueAssignment(validPlayersByCell)) {
    return null;
  }

  return {
    rowClubs,
    columnClubs,
    validPlayersByCell,
    allPlayerNames: data.allPlayerNames,
  };
}

function getFallbackPuzzle(data: GridData): GridPuzzle {
  const shuffledClubs = data.allClubs;

  for (let i = 0; i < shuffledClubs.length; i += 1) {
    for (let j = 0; j < shuffledClubs.length; j += 1) {
      if (j === i) {
        continue;
      }
      for (let k = 0; k < shuffledClubs.length; k += 1) {
        if (k === i || k === j) {
          continue;
        }
        for (let a = 0; a < shuffledClubs.length; a += 1) {
          if (a === i || a === j || a === k) {
            continue;
          }
          for (let b = 0; b < shuffledClubs.length; b += 1) {
            if (b === i || b === j || b === k || b === a) {
              continue;
            }
            for (let c = 0; c < shuffledClubs.length; c += 1) {
              if (c === i || c === j || c === k || c === a || c === b) {
                continue;
              }

              const puzzle = buildPuzzleFromClubs(
                data,
                [shuffledClubs[i], shuffledClubs[j], shuffledClubs[k]],
                [shuffledClubs[a], shuffledClubs[b], shuffledClubs[c]]
              );

              if (puzzle) {
                return puzzle;
              }
            }
          }
        }
      }
    }
  }

  throw new Error('Unable to generate a valid grid puzzle from the current career data.');
}

function generatePuzzleForDay(daysSinceEpoch: number): GridPuzzle {
  const data = getGridData();
  const rng = createRng(daysSinceEpoch * 7919 + 17);
  const clubs = shuffle(data.allClubs, rng);
  let bestPuzzle: GridPuzzle | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const sampledClubs = shuffle(clubs, rng).slice(0, 6);
    if (sampledClubs.length < 6) {
      continue;
    }

    const puzzle = buildPuzzleFromClubs(
      data,
      [sampledClubs[0], sampledClubs[1], sampledClubs[2]],
      [sampledClubs[3], sampledClubs[4], sampledClubs[5]]
    );

    if (!puzzle) {
      continue;
    }

    const currentScore = scoreGrid(puzzle.validPlayersByCell);
    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestPuzzle = puzzle;
    }
  }

  return bestPuzzle ?? getFallbackPuzzle(data);
}

export function getGridPuzzle(date = new Date()): GridPuzzle {
  const daysSinceEpoch = Math.floor(date.getTime() / MILLISECONDS_IN_DAY);
  const cachedPuzzle = puzzleCache.get(daysSinceEpoch);

  if (cachedPuzzle) {
    return cachedPuzzle;
  }

  const puzzle = generatePuzzleForDay(daysSinceEpoch);
  puzzleCache.set(daysSinceEpoch, puzzle);
  return puzzle;
}

export function getGridPuzzleNumber(date = new Date()): number {
  return Math.floor(date.getTime() / MILLISECONDS_IN_DAY);
}

export function validateGridGuess(
  puzzle: GridPuzzle,
  rowIndex: number,
  columnIndex: number,
  guess: string,
  usedPlayerNames: string[]
): { code: GridGuessValidationCode; reason?: string; playerName?: string } {
  const normalizedGuess = guess.trim().toLowerCase();
  const matchingName = puzzle.allPlayerNames.find((playerName) => playerName.toLowerCase() === normalizedGuess);

  if (!matchingName) {
    return { code: 'unknown_player', reason: 'Pick a player from the list.' };
  }

  if (usedPlayerNames.some((playerName) => playerName.toLowerCase() === normalizedGuess)) {
    return { code: 'duplicate_player', reason: 'That player is already used elsewhere in the grid.' };
  }

  const validPlayers = puzzle.validPlayersByCell[rowIndex]?.[columnIndex] ?? [];
  const isMatch = validPlayers.some((playerName) => playerName.toLowerCase() === normalizedGuess);

  if (!isMatch) {
    return {
      code: 'wrong_cell',
      reason: `That player did not play for both ${puzzle.rowClubs[rowIndex]} and ${puzzle.columnClubs[columnIndex]}.`,
    };
  }

  return { code: 'valid', playerName: matchingName };
}
