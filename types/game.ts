import { Player, GuessResponse } from './player';

export interface GameState {
  guesses: Array<{
    playerName: string;
    result: GuessResponse;
  }>;
  currentGuess: string;
  dailyPlayer: Player | null;
  gameOver: boolean;
  won: boolean;
} 