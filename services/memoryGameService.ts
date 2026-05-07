import { players } from '../data/players';
import { Player } from '../types/player';

export interface MemoryRound {
  id: string;
  target: Player;
  options: Player[];
}

export interface MemoryGuess {
  roundId: string;
  target: Player;
  selected: Player;
  score: number;
}

const ROUND_COUNT = 5;
const OPTION_COUNT = 10;

const positionDistance: Record<Player['position'], Record<Player['position'], number>> = {
  Goalkeeper: {
    Goalkeeper: 0,
    Defender: 4,
    Midfielder: 4,
    Forward: 4,
  },
  Defender: {
    Goalkeeper: 4,
    Defender: 0,
    Midfielder: 1.5,
    Forward: 2.5,
  },
  Midfielder: {
    Goalkeeper: 4,
    Defender: 1.5,
    Midfielder: 0,
    Forward: 1.3,
  },
  Forward: {
    Goalkeeper: 4,
    Defender: 2.5,
    Midfielder: 1.3,
    Forward: 0,
  },
};

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function randomInt(max: number): number {
  if (typeof window !== 'undefined' && window.crypto) {
    const value = new Uint32Array(1);
    window.crypto.getRandomValues(value);
    return value[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index--) {
    const swapIndex = randomInt(index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function pickWeightedSimilarPlayers(target: Player, usedTargetIds: Set<number>): Player[] {
  const ranked = players
    .filter((player) => player.id !== target.id)
    .map((player) => ({
      player,
      distance: getPlayerSimilarityDistance(target, player),
    }))
    .sort((a, b) => a.distance - b.distance);

  const closePool = ranked.slice(0, Math.min(36, ranked.length));
  const firstPass = closePool.filter(({ player }) => !usedTargetIds.has(player.id));
  const source = firstPass.length >= OPTION_COUNT - 1 ? firstPass : closePool;
  const selected: Player[] = [];
  const selectedIds = new Set<number>();

  for (const item of shuffle(source)) {
    if (selectedIds.has(item.player.id)) {
      continue;
    }

    selected.push(item.player);
    selectedIds.add(item.player.id);

    if (selected.length === OPTION_COUNT - 1) {
      break;
    }
  }

  return selected;
}

export function getPlayerSimilarityDistance(target: Player, candidate: Player): number {
  const targetAge = calculateAge(target.dateOfBirth);
  const candidateAge = calculateAge(candidate.dateOfBirth);
  const ageDistance = Math.min(Math.abs(targetAge - candidateAge), 12) / 12;
  const heightDistance = Math.min(Math.abs(target.height - candidate.height), 22) / 22;
  const samePosition = target.position === candidate.position;

  let distance = 0;
  distance += positionDistance[target.position][candidate.position];
  distance += target.subPosition === candidate.subPosition ? 0 : samePosition ? 0.85 : 1.8;
  distance += ageDistance * 1.35;
  distance += heightDistance * 0.9;
  distance += target.league === candidate.league ? 0 : 0.75;
  distance += target.nationality === candidate.nationality ? 0 : 0.7;
  distance += target.foot === candidate.foot ? 0 : 0.35;

  return distance;
}

export function scoreMemoryGuess(target: Player, selected: Player): number {
  if (target.id === selected.id) {
    return 10;
  }

  const distance = getPlayerSimilarityDistance(target, selected);
  return Math.max(1, Math.min(9, Math.round(9 - distance * 1.8)));
}

export function createMemoryGame(roundCount = ROUND_COUNT): MemoryRound[] {
  const usedTargetIds = new Set<number>();
  const rounds: MemoryRound[] = [];
  const candidateTargets = shuffle(players);

  for (const target of candidateTargets) {
    if (rounds.length === roundCount) {
      break;
    }

    if (usedTargetIds.has(target.id)) {
      continue;
    }

    const similarPlayers = pickWeightedSimilarPlayers(target, usedTargetIds);

    if (similarPlayers.length < OPTION_COUNT - 1) {
      continue;
    }

    usedTargetIds.add(target.id);
    rounds.push({
      id: `${Date.now()}-${target.id}-${rounds.length}`,
      target,
      options: shuffle([target, ...similarPlayers]),
    });
  }

  return rounds;
}

export function getPlayerAge(player: Player): number {
  return calculateAge(player.dateOfBirth);
}
