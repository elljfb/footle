import squadNumberData from '../data/premier_league_squad_numbers.json';

interface SquadNumberRecord {
  season: string;
  club: string;
  squad_number: number;
  player: string;
  position: string;
}

export interface ShirtNumberQuestion {
  id: string;
  season: string;
  club: string;
  squadNumber: number;
  answer: string;
  options: string[];
}

const records: SquadNumberRecord[] = squadNumberData;

function getSlotKey(record: SquadNumberRecord): string {
  return `${record.season}\u0000${record.club}\u0000${record.squad_number}`;
}

function createSeededRandom(seed: string): () => number {
  let state = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: T[], random: () => number): T[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function addPlayerToGroup(groups: Map<string, Set<string>>, key: string, player: string) {
  const players = groups.get(key) ?? new Set<string>();
  players.add(player);
  groups.set(key, players);
}

export function createPremierLeagueShirtNumberQuestions(
  challengeDate: string,
  count = 5
): ShirtNumberQuestion[] {
  const random = createSeededRandom(`premier-league-shirt-number:${challengeDate}`);
  const playersBySlot = new Map<string, Set<string>>();
  const playersBySquad = new Map<string, Set<string>>();
  const playersBySeason = new Map<string, Set<string>>();
  const allPlayers = new Set<string>();

  for (const record of records) {
    const player = record.player.trim();
    if (!player) continue;

    addPlayerToGroup(playersBySlot, getSlotKey(record), player);
    addPlayerToGroup(playersBySquad, `${record.season}\u0000${record.club}`, player);
    addPlayerToGroup(playersBySeason, record.season, player);
    allPlayers.add(player);
  }

  const uniqueTargets = new Map<string, SquadNumberRecord>();
  for (const record of records) {
    const slotKey = getSlotKey(record);
    const slotPlayers = playersBySlot.get(slotKey);
    if (slotPlayers?.size === 1 && !uniqueTargets.has(slotKey)) {
      uniqueTargets.set(slotKey, record);
    }
  }

  const questions: ShirtNumberQuestion[] = [];
  const usedAnswers = new Set<string>();

  for (const target of shuffle(Array.from(uniqueTargets.values()), random)) {
    const answer = target.player.trim();
    if (usedAnswers.has(answer)) continue;

    const squadPlayers = Array.from(playersBySquad.get(`${target.season}\u0000${target.club}`) ?? []);
    const seasonPlayers = Array.from(playersBySeason.get(target.season) ?? []);
    const distractorPool = (squadPlayers.length >= 4 ? squadPlayers : seasonPlayers)
      .filter((player) => player !== answer);
    const expandedDistractorPool = distractorPool.length >= 3
      ? distractorPool
      : Array.from(allPlayers).filter((player) => player !== answer);

    if (expandedDistractorPool.length < 3) continue;

    const options = shuffle([answer, ...shuffle(expandedDistractorPool, random).slice(0, 3)], random);
    questions.push({
      id: getSlotKey(target),
      season: target.season,
      club: target.club,
      squadNumber: target.squad_number,
      answer,
      options,
    });
    usedAnswers.add(answer);

    if (questions.length === count) break;
  }

  if (questions.length !== count) {
    throw new Error(`Could not create ${count} unambiguous Premier League shirt number questions.`);
  }

  return questions;
}
