import { createGameOgImage, gameOgImageContentType, gameOgImageSize } from '../../../lib/game-og-image';
import { slugToLeagueName } from '../../../lib/leagues';

export const size = gameOgImageSize;
export const contentType = gameOgImageContentType;
export const runtime = 'nodejs';

interface Props {
  params: Promise<{ league: string }>;
}

export default async function OpenGraphImage({ params }: Props) {
  const { league: slug } = await params;
  const leagueName = slugToLeagueName[slug] ?? decodeURIComponent(slug);

  return createGameOgImage(`${leagueName} Footle`, `The daily ${leagueName} player guessing game`);
}
