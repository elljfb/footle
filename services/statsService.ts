import { GameStats, DailyResult } from '../types/game';

const STATS_KEY_PREFIX = 'footle_stats';
const HISTORY_KEY_PREFIX = 'footle_history';

export function getStatsKey(gameType: string): string {
  return `${STATS_KEY_PREFIX}_${gameType}`;
}

export function getHistoryKey(gameType: string): string {
  return `${HISTORY_KEY_PREFIX}_${gameType}`;
}

export function getStats(gameType: string): GameStats {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  const key = getStatsKey(gameType);
  const saved = localStorage.getItem(key);
  
  if (!saved) {
    return getDefaultStats();
  }

  try {
    return JSON.parse(saved);
  } catch {
    return getDefaultStats();
  }
}

export function getDefaultStats(): GameStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {},
    lastPlayedDate: '',
    averageGuesses: 0,
  };
}

export function saveGameResult(
  gameType: string,
  won: boolean,
  guesses: number,
  time: number,
  maxGuesses: number
): GameStats {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  const today = new Date().toISOString().split('T')[0];
  const stats = getStats(gameType);
  const history = getHistory(gameType);

  // Check if already played today
  const alreadyPlayedToday = history.some(result => result.date === today);
  if (alreadyPlayedToday) {
    return stats; // Don't update if already played today
  }

  // Update stats
  stats.gamesPlayed += 1;
  stats.lastPlayedDate = today;

  if (won) {
    stats.gamesWon += 1;
    
    // Update guess distribution
    if (!stats.guessDistribution[guesses]) {
      stats.guessDistribution[guesses] = 0;
    }
    stats.guessDistribution[guesses] += 1;

    // Update streaks
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (stats.lastPlayedDate === yesterdayStr || stats.lastPlayedDate === '') {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    }

    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
  } else {
    // Lost - reset current streak
    stats.currentStreak = 0;
  }

  // Calculate average guesses (only for wins)
  if (stats.gamesWon > 0) {
    const totalGuesses = Object.entries(stats.guessDistribution).reduce(
      (sum, [guesses, count]) => sum + (parseInt(guesses) * count),
      0
    );
    stats.averageGuesses = Math.round((totalGuesses / stats.gamesWon) * 10) / 10;
  }

  // Save stats
  localStorage.setItem(getStatsKey(gameType), JSON.stringify(stats));

  // Save to history
  const newResult: DailyResult = {
    date: today,
    won,
    guesses: won ? guesses : maxGuesses,
    time,
  };
  history.push(newResult);
  localStorage.setItem(getHistoryKey(gameType), JSON.stringify(history));

  return stats;
}

export function getHistory(gameType: string): DailyResult[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const key = getHistoryKey(gameType);
  const saved = localStorage.getItem(key);
  
  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function hasPlayedToday(gameType: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const history = getHistory(gameType);
  return history.some(result => result.date === today);
}

export function getWinPercentage(stats: GameStats): number {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
}

export function getGuessDistributionWithMax(
  stats: GameStats,
  maxGuesses: number
): Array<{ guesses: number; count: number; percentage: number }> {
  const maxCount = Math.max(...Object.values(stats.guessDistribution), 1);
  const distribution = [];

  for (let i = 1; i <= maxGuesses; i++) {
    const count = stats.guessDistribution[i] || 0;
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
    distribution.push({ guesses: i, count, percentage });
  }

  return distribution;
}
