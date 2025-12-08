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
  startTime?: number;
  endTime?: number;
}

export interface LeaderboardEntry {
  nickname: string;
  guesses: number;
  time: number; // time in seconds
  date: string;
  timestamp: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: { [key: number]: number }; // e.g., { 1: 5, 2: 10, 3: 8 }
  lastPlayedDate: string;
  averageGuesses: number;
}

export interface DailyResult {
  date: string;
  won: boolean;
  guesses: number;
  time: number;
} 