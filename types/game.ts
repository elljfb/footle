import { Player, GuessResponse } from './player';

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

export interface GameState {
  guesses: Array<{ playerName: string; result: GuessResponseWithValues }>;
  currentGuess: string;
  dailyPlayer: Player | null;
  gameOver: boolean;
  won: boolean;
} 