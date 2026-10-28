import { createGameOgImage, gameOgImageContentType, gameOgImageSize } from '../../lib/game-og-image';

export const size = gameOgImageSize;
export const contentType = gameOgImageContentType;
export const runtime = 'nodejs';

export default function OpenGraphImage() {
  return createGameOgImage('Footle Player of the Season', 'Build a footballer and simulate a Premier League season');
}
