import { players } from '../data/players';
import { supabase } from '../lib/supabase';
import { CustomGame, CustomGameWithPlayer } from '../types/customGame';
import { getPlayersByLeagues } from './gameService';

interface CreateCustomGameInput {
  title?: string;
  playerName: string;
  selectedLeagues?: string[];
}

const FOOTBALL_WORDS = [
  'goal',
  'pass',
  'assist',
  'midfield',
  'defender',
  'striker',
  'stadium',
  'derby',
  'corner',
  'tackle',
  'captain',
  'clean-sheet',
  'kickoff',
  'halftime',
  'fulltime',
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

async function slugExists(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('custom_games')
    .select('id')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

function randomFootballSlugBase(): string {
  const pickWord = () => FOOTBALL_WORDS[Math.floor(Math.random() * FOOTBALL_WORDS.length)];
  return `${pickWord()}-${pickWord()}-${pickWord()}`;
}

async function buildUniqueSlug(baseValue: string): Promise<string> {
  const base = slugify(baseValue) || 'custom-footle';

  if (!(await slugExists(base))) {
    return base;
  }

  for (let i = 2; i < 2000; i++) {
    const candidate = `${base}-${i}`;
    if (!(await slugExists(candidate))) {
      return candidate;
    }
  }

  throw new Error('Could not generate a unique slug. Please try another title.');
}

function mapRowToCustomGame(row: any): CustomGame {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    targetPlayerId: row.target_player_id,
    selectedLeagues: row.selected_leagues,
    createdAt: row.created_at,
  };
}

export async function createCustomGame(input: CreateCustomGameInput): Promise<CustomGameWithPlayer> {
  const selectedLeagues = input.selectedLeagues && input.selectedLeagues.length > 0
    ? Array.from(new Set(input.selectedLeagues))
    : null;

  const pool = getPlayersByLeagues(selectedLeagues ?? undefined);
  const targetPlayer = pool.find((player) => player.name.toLowerCase() === input.playerName.trim().toLowerCase());

  if (!targetPlayer) {
    throw new Error('Selected player is not available for the chosen leagues.');
  }

  const slugBase = input.title?.trim() || randomFootballSlugBase();
  const slug = await buildUniqueSlug(slugBase);
  const normalizedTitle = input.title?.trim() || null;

  const { data, error } = await supabase
    .from('custom_games')
    .insert({
      slug,
      title: normalizedTitle,
      target_player_id: targetPlayer.id,
      selected_leagues: selectedLeagues,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to create custom game.');
  }

  return {
    ...mapRowToCustomGame(data),
    targetPlayer,
  };
}

export async function getCustomGameBySlug(slug: string): Promise<CustomGameWithPlayer | null> {
  const { data, error } = await supabase
    .from('custom_games')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const customGame = mapRowToCustomGame(data);
  const targetPlayer = players.find((player) => player.id === customGame.targetPlayerId);

  if (!targetPlayer) {
    return null;
  }

  return {
    ...customGame,
    targetPlayer,
  };
}
