import { Player, Position, SubPosition, GuessResult, GuessResponse, Foot, GuessResponseWithValues } from '../types/player';
import { players } from '../data/players';
import { areInSameContinent } from '../utils/continents';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

// Get the daily player. Optionally pass a league to restrict selection to that league.
export function getDailyPlayer(league?: string): Player {
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / MILLISECONDS_IN_DAY);
  const prime = 1327;

  const filtered = league ? players.filter(p => p.league === league) : players;
  const pool = filtered.length > 0 ? filtered : players; // fallback to full list if no players for league

  const totalPlayers = pool.length;
  const playerIndex = (daysSinceEpoch * prime) % totalPlayers;
  return pool[playerIndex];
}

function comparePositions(guess: Position, target: Position): GuessResult {
  return guess === target ? 'correct' : 'incorrect';
}

function compareSubPositions(guess: SubPosition, target: SubPosition, guessPosition: Position, targetPosition: Position): GuessResult {
  if (guessPosition !== targetPosition) return 'incorrect';
  return guess === target ? 'correct' : 'close';
}

function compareAges(guess: number, target: number): GuessResult {
  const diff = Math.abs(guess - target);
  return diff === 0 ? 'correct' : 
    (diff <= 3 ? 'close' : 'incorrect');
}

function compareStrings(guess: string, target: string): GuessResult {
  return guess === target ? 'correct' : 'incorrect';
}

function compareNationalities(guess: string, target: string): GuessResult {
  if (guess === target) return 'correct';
  return areInSameContinent(guess, target) ? 'close' : 'incorrect';
}

function compareClubs(guess: string, target: string, guessLeague: string, targetLeague: string): GuessResult {
  if (guess === target) return 'correct';
  return guessLeague === targetLeague ? 'close' : 'incorrect';
}

function compareHeights(guess: number, target: number): GuessResult {
  const diff = Math.abs(guess - target);
  return diff === 0 ? 'correct' : 
    (diff <= 5 ? 'close' : 'incorrect');
}

export function checkGuess(target: Player, guess: string, league?: string): GuessResponseWithValues | null {
  const filtered = league ? players.filter(p => p.league === league) : players;
  const pool = filtered.length > 0 ? filtered : players;

  const guessedPlayer = pool.find(p => p.name.toLowerCase() === guess.toLowerCase());
  if (!guessedPlayer) return null;

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const targetAge = calculateAge(target.dateOfBirth);
  const guessAge = calculateAge(guessedPlayer.dateOfBirth);

  return {
    isCorrect: guessedPlayer.id === target.id,
    position: comparePositions(guessedPlayer.position, target.position),
    subPosition: compareSubPositions(guessedPlayer.subPosition, target.subPosition, guessedPlayer.position, target.position),
    age: compareAges(guessAge, targetAge),
    nationality: compareNationalities(guessedPlayer.nationality, target.nationality),
    club: compareClubs(guessedPlayer.club, target.club, guessedPlayer.league, target.league),
    league: compareStrings(guessedPlayer.league, target.league),
    height: compareHeights(guessedPlayer.height, target.height),
    foot: guessedPlayer.foot === target.foot ? 'correct' : 'incorrect',
    values: {
      position: guessedPlayer.position,
      subPosition: guessedPlayer.subPosition,
      age: guessAge,
      nationality: guessedPlayer.nationality,
      club: guessedPlayer.club,
      league: guessedPlayer.league,
      height: guessedPlayer.height,
      foot: guessedPlayer.foot,
    },
    targetValues: {
      age: targetAge,
      height: target.height,
    },
  };
}

// Helper function to get all available player names for autocomplete
export function getPlayerNames(league?: string): string[] {
  const filtered = league ? players.filter(p => p.league === league) : players;
  const pool = filtered.length > 0 ? filtered : players;
  return pool.map(p => p.name);
}
