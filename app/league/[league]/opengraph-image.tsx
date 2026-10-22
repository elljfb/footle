import { createGameOgImage, gameOgImageContentType, gameOgImageSize } from '../../../lib/game-og-image';
import { slugToLeagueName } from '../../../lib/leagues';

export const size = gameOgImageSize;
export const contentType = gameOgImageContentType;
export const runtime = 'nodejs';

export default async function OpenGraphImage({ params }: { params: Promise<{ league: string }> }) {
  const { league } = await params;
  const leagueName = slugToLeagueName[league] ?? league.replace(/-/g, ' ');
  return createGameOgImage(`${leagueName} Footle`, `Guess today's mystery ${leagueName} player`);
}
