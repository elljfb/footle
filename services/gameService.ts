import { Player, Position, SubPosition, GuessResult, GuessResponse, Foot } from '../types/player';
import { players } from '../data/players';
import { areInSameContinent } from '../utils/continents';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

export function getDailyPlayer(): Player {
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / MILLISECONDS_IN_DAY);
  const playerIndex = daysSinceEpoch % players.length;
  return players[playerIndex];
}

export interface GuessResponseWithValues extends GuessResponse {
  values: {
    position: Position;
    subPosition: SubPosition;
    age: number;
    nationality: string;
    club: string;
    league: string;
    height: number;
    foot: Foot;
  };
}

function comparePositions(guess: Position, target: Position): GuessResult {
  return guess === target ? 'correct' : 'incorrect';
}

function compareSubPositions(guess: SubPosition, target: SubPosition): GuessResult {
  return guess === target ? 'correct' : 'incorrect';
}

function compareAges(guess: number, target: number): GuessResult {
  const diff = Math.abs(guess - target);
  return diff === 0 ? 'correct' : 
    (diff <= 3 ? 'close' : 'incorrect');
}

function compareStrings(guess: string, target: string): GuessResult {
  return guess === target ? 'correct' : 'incorrect';
}

function compareHeights(guess: number, target: number): GuessResult {
  const diff = Math.abs(guess - target);
  return diff === 0 ? 'correct' : 
    (diff <= 5 ? 'close' : 'incorrect');
}

export function checkGuess(target: Player, guess: string): GuessResponseWithValues | null {
  const guessedPlayer = players.find(p => p.name.toLowerCase() === guess.toLowerCase());
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
    subPosition: compareSubPositions(guessedPlayer.subPosition, target.subPosition),
    age: compareAges(guessAge, targetAge),
    nationality: compareStrings(guessedPlayer.nationality, target.nationality),
    club: compareStrings(guessedPlayer.club, target.club),
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
  };
}

// Helper function to get all available player names for autocomplete
export function getPlayerNames(): string[] {
  return players.map(p => p.name);
} 