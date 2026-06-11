import { type NextRequest } from 'next/server';
import { createEightZeroOgImageResponse } from '../../../../../lib/eight-zero-og-image';
import { getWorldCupShareBySlug } from '../../../../../services/eightZeroShareService';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
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

