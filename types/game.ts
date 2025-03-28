import { Player, GuessResponseWithValues } from './player';

export interface GameState {
  guesses: Array<{
    playerName: string;
    result: GuessResponseWithValues;
  }>;
  currentGuess: string;
  dailyPlayer: Player | null;
  gameOver: boolean;
  won: boolean;
} 