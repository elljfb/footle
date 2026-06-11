import { createEightZeroOgImageResponse } from '../../../../lib/eight-zero-og-image';
import { getWorldCupShareBySlug } from '../../../../services/eightZeroShareService';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const share = await getWorldCupShareBySlug(slug);
    if (!share) return new Response('Not found', { status: 404 });

    return createEightZeroOgImageResponse(share);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error generating image';
    return new Response(message, { status: 500 });
  }
}

