import { supabase } from '../lib/supabase';
import {
  getSeasonAwards,
  getSeasonSummaryLabel,
  getPlayerPositionLabel,
  type PlayerBuild,
  type PlayerSeasonSummary,
} from '../lib/player-of-the-season';

export interface PlayerOfTheSeasonShareRow {
  id: number;
  slug: string;
  share_text: string;
  player_build: PlayerBuild;
  season: PlayerSeasonSummary;
  created_at: string;
}

function getOrdinal(position: number): string {
  if (position % 100 >= 11 && position % 100 <= 13) return `${position}th`;
  switch (position % 10) {
    case 1: return `${position}st`;
    case 2: return `${position}nd`;
    case 3: return `${position}rd`;
    default: return `${position}th`;
  }
}

export function getPlayerOfTheSeasonShareText(
  build: PlayerBuild,
  season: PlayerSeasonSummary,
): string {
  const clubTableEntry = season.table.find((entry) => entry.team.id === season.club.id);
  if (!clubTableEntry) {
    throw new Error(`Missing league table entry for ${season.club.name}.`);
  }

  const performance = `My ${getPlayerPositionLabel(build.position)} ${build.name} scored ${season.goals} goals and added ${season.assists} assists, averaging ${season.averageRating.toFixed(1)}/10 as ${season.club.name} finished ${getOrdinal(season.tablePosition)} on ${clubTableEntry.points} pts.`;
  const awardsList = getSeasonAwards(season);
  const awards = awardsList.length ? `\nThey also won ${awardsList.join(', ')}.` : '';

  return `${performance}\nSeason: ${getSeasonSummaryLabel(season, build.age)}.${awards}`;
}

export async function createPlayerOfTheSeasonShare(
  build: PlayerBuild,
  season: PlayerSeasonSummary,
): Promise<PlayerOfTheSeasonShareRow> {
  const slug = `season-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
  const shareText = getPlayerOfTheSeasonShareText(build, season);

  const { data, error } = await supabase
    .from('player_of_the_season_shares')
    .insert({
      slug,
      share_text: shareText,
      player_build: build,
      season,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Unable to save Player of the Season share.');
  }

  return data as PlayerOfTheSeasonShareRow;
}

export async function getPlayerOfTheSeasonShareBySlug(
  slug: string,
): Promise<PlayerOfTheSeasonShareRow | null> {
  const { data, error } = await supabase
    .from('player_of_the_season_shares')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching Player of the Season share:', error);
    return null;
  }

  return data as PlayerOfTheSeasonShareRow | null;
}
