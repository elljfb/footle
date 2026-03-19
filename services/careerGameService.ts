import footballCareers, { CareerSpell, PlayerCareer } from '../data/footballCareers';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

interface CareerSpellWithSortData extends CareerSpell {
  startYear: number;
  originalIndex: number;
}

export interface CareerGamePlayer extends PlayerCareer {
  clueCareer: CareerSpell[];
}

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

function buildClueCareer(player: PlayerCareer): CareerSpell[] {
  const sorted = player.seniorCareer
    .map((spell, index): CareerSpellWithSortData => ({
      ...spell,
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
    });

  return sorted.reduce<CareerSpell[]>((acc, spell) => {
    const previous = acc[acc.length - 1];
    if (previous?.club === spell.club && previous?.years === spell.years) {
      return acc;
    }

    acc.push({
      years: spell.years,
      club: spell.club,
      apps: spell.apps,
      goals: spell.goals,
    });
    return acc;
  }, []);
}

function isPlayableCareer(player: PlayerCareer): boolean {
  if (player.error || player.seniorCareer.length === 0) {
    return false;
  }

  return buildClueCareer(player).length >= 3;
}

const careerPlayers: CareerGamePlayer[] = footballCareers
  .filter(isPlayableCareer)
  .map((player) => ({
    ...player,
    clueCareer: buildClueCareer(player),
  }));

export function getCareerPlayers(): CareerGamePlayer[] {
  return careerPlayers;
}

export function getDailyCareerPlayer(date = new Date()): CareerGamePlayer {
  const daysSinceEpoch = Math.floor(date.getTime() / MILLISECONDS_IN_DAY);
  const prime = 1327;
  const index = (daysSinceEpoch * prime) % careerPlayers.length;
  return careerPlayers[index];
}

export function getCareerPlayerNames(): string[] {
  return careerPlayers.map((player) => player.name);
}

export function checkCareerGuess(target: CareerGamePlayer, guess: string): boolean {
  return target.name.toLowerCase() === guess.trim().toLowerCase();
}

export function getVisibleCareerClues(player: CareerGamePlayer, guessCount: number): CareerSpell[] {
  const visibleCount = Math.min(2 + guessCount, player.clueCareer.length);
  return player.clueCareer.slice(0, visibleCount);
}
