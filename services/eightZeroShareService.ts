import { supabase } from '../lib/supabase';
import { DraftPick, TournamentResult } from '../lib/eight-zero';

const SHARE_WORDS = [
  'world',
  'cup',
  'champion',
  'dream',
  'final',
  'goal',
  'legend',
  'magic',
  'glory',
  'squad',
  'win',
  'match',
  'trophy',
  'cuprun',
  'hero',
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48);
}

async function slugExists(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('eight_zero_shares')
    .select('id')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function buildUniqueSlug(baseValue: string): Promise<string> {
  const base = slugify(baseValue) || `world-cup-${Math.floor(Math.random() * 10000)}`;

  if (!(await slugExists(base))) {
    return base;
  }

  for (let i = 2; i < 2000; i += 1) {
    const candidate = `${base}-${i}`;
    if (!(await slugExists(candidate))) {
      return candidate;
    }
  }

  const fallback = `${base}-${Date.now()}`;
  return fallback;
}

function randomShareSlugBase(): string {
  const first = SHARE_WORDS[Math.floor(Math.random() * SHARE_WORDS.length)];
  const second = SHARE_WORDS[Math.floor(Math.random() * SHARE_WORDS.length)];
  return `${first}-${second}`;
}

export interface EightZeroShareRow {
  id: number;
  slug: string;
  share_text: string;
  team_overall: number;
  finish: number;
  medal: TournamentResult['medal'];
  eliminated_at: string | null;
  record: { wins: number; draws: number; losses: number };
  result: TournamentResult;
  picks: DraftPick[];
  top_scorer: string | null;
  top_scorer_goals: number;
  created_at: string;
}

interface CreateWorldCupShareInput {
  result: TournamentResult;
  picks: DraftPick[];
  teamOverall: number;
  shareText: string;
  topScorer: string | null;
  topScorerGoals: number;
}

export async function createWorldCupShare(
  input: CreateWorldCupShareInput
): Promise<EightZeroShareRow> {
  // build a concise, structured slug rather than using the full share text
  const outcomeLabel = input.result.wonWorldCup
    ? 'champion'
    : input.result.medal
    ? String(input.result.medal).toLowerCase()
    : input.result.eliminatedAt
    ? String(input.result.eliminatedAt).toLowerCase().replace(/\s+/g, '-')
    : `finished-${input.result.finish}`;

  const scorerPart = input.topScorer ? slugify(input.topScorer.split(' ')[0]) : randomShareSlugBase();
  function randomAlphaNum(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < length; i += 1) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  const slugBase = randomAlphaNum(8);
  const slug = await buildUniqueSlug(slugBase);

  const { data, error } = await supabase
    .from('eight_zero_shares')
    .insert([
      {
        slug,
        share_text: input.shareText,
        // store team overall rounded to one decimal to match display
        team_overall: Math.round(input.teamOverall * 10) / 10,
        finish: input.result.finish,
        medal: input.result.medal,
        eliminated_at: input.result.eliminatedAt,
        record: input.result.record,
        result: input.result,
        picks: input.picks,
        top_scorer: input.topScorer,
        top_scorer_goals: input.topScorerGoals,
      },
    ])
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Unable to save World Cup share.');
  }

  return data as EightZeroShareRow;
}

export async function getWorldCupShareBySlug(slug: string): Promise<EightZeroShareRow | null> {
  const { data, error } = await supabase
    .from('eight_zero_shares')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching world cup share:', error);
    return null;
  }

  return data as EightZeroShareRow | null;
}
