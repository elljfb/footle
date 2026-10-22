import { createGameOgImage, gameOgImageContentType, gameOgImageSize } from '../../lib/game-og-image';

export const size = gameOgImageSize;
export const contentType = gameOgImageContentType;
export const runtime = 'nodejs';

export default function OpenGraphImage() {
  return createGameOgImage('Footle Recall', 'A football player memory challenge');
}
