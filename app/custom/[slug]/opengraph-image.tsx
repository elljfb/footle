import { createGameOgImage, gameOgImageContentType, gameOgImageSize } from '../../../lib/game-og-image';

export const size = gameOgImageSize;
export const contentType = gameOgImageContentType;
export const runtime = 'nodejs';

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const displayTitle = title.length > 34 ? `${title.slice(0, 31)}...` : title;
  return createGameOgImage(displayTitle, 'A custom football guessing challenge');
}
