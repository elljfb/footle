import { Player, GuessResponse } from '../types/player';
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
    position: string;
    subPosition: string;
    age: number;
    nationality: string;
    club: string;
    league: string;
    height: number;
    foot: string;
  }
}

export function checkGuess(player: Player, guessedName: string): GuessResponseWithValues | null {
  const guessedPlayer = players.find(p => 
    p.name.toLowerCase() === guessedName.toLowerCase()
  );

  if (!guessedPlayer) {
    return null;
  }

  const ageDiff = Math.abs(player.age - guessedPlayer.age);
  const heightDiff = Math.abs(player.height - guessedPlayer.height);

  return {
    position: player.position === guessedPlayer.position ? 'correct' : 'incorrect',
    subPosition: player.subPosition === guessedPlayer.subPosition ? 'correct' : 
      (player.position === guessedPlayer.position ? 'close' : 'incorrect'),
    age: ageDiff === 0 ? 'correct' : 
      (ageDiff <= 3 ? 'close' : 'incorrect'),
    nationality: player.nationality === guessedPlayer.nationality ? 'correct' : 
      (areInSameContinent(player.nationality, guessedPlayer.nationality) ? 'close' : 'incorrect'),
    club: player.club === guessedPlayer.club ? 'correct' : 
      (player.league === guessedPlayer.league ? 'close' : 'incorrect'),
    league: player.league === guessedPlayer.league ? 'correct' : 'incorrect',
    height: heightDiff === 0 ? 'correct' : 
      (heightDiff <= 5 ? 'close' : 'incorrect'),
    foot: player.foot === guessedPlayer.foot ? 'correct' : 'incorrect',
    isCorrect: player.id === guessedPlayer.id,
    values: {
      position: guessedPlayer.position,
      subPosition: guessedPlayer.subPosition,
      age: guessedPlayer.age,
      nationality: guessedPlayer.nationality,
      club: guessedPlayer.club,
      league: guessedPlayer.league,
      height: guessedPlayer.height,
      foot: guessedPlayer.foot,
    }
  };
}

// Helper function to get all available player names for autocomplete
export function getPlayerNames(): string[] {
  return players.map(p => p.name);
} 