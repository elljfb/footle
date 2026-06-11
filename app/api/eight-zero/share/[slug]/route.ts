import { NextResponse, type NextRequest } from 'next/server';
import { getWorldCupShareBySlug } from '../../../../../services/eightZeroShareService';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const share = await getWorldCupShareBySlug(slug);
    if (!share) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ share });
  } catch (err) {
    console.error('API share fetch error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
