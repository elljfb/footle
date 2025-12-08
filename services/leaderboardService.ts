import { LeaderboardEntry } from '../types/game';
import { supabase } from '../lib/supabase';

const LEADERBOARD_KEY_PREFIX = 'footle_leaderboard';

export function getLeaderboardKey(gameType: string): string {
  return `${LEADERBOARD_KEY_PREFIX}_${gameType}`;
}

export async function saveToLeaderboard(
  gameType: string,
  nickname: string,
  guesses: number,
  time: number
): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const entry = {
    game_type: gameType,
    nickname: nickname.trim(),
    guesses,
    time,
    date: today,
  };

  const { error } = await supabase
    .from('leaderboard')
    .insert([entry]);

  if (error) {
    console.error('Error saving to leaderboard:', error);
    throw error;
  }

  // Mark as submitted in localStorage
  if (typeof window !== 'undefined') {
    const key = `${LEADERBOARD_KEY_PREFIX}_submitted_${gameType}`;
    localStorage.setItem(key, today);
  }
}

export async function getLeaderboard(gameType: string): Promise<LeaderboardEntry[]> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('game_type', gameType)
    .eq('date', today)
    .order('guesses', { ascending: true })
    .order('time', { ascending: true })
    .limit(100);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return (data || []).map(entry => ({
    nickname: entry.nickname,
    guesses: entry.guesses,
    time: entry.time,
    date: entry.date,
    timestamp: new Date(entry.created_at).getTime(),
  }));
}

export function hasSubmittedToday(gameType: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const key = `${LEADERBOARD_KEY_PREFIX}_submitted_${gameType}`;
  const today = new Date().toISOString().split('T')[0];
  const lastSubmitted = localStorage.getItem(key);
  
  return lastSubmitted === today;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
