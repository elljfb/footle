import type { Metadata } from 'next';
import CustomGameClient from './CustomGameClient';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugLabel = params.slug.replace(/-/g, ' ');
  const title = `Footle Custom - ${slugLabel}`;
  const description = 'Play a shared custom Footle challenge.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://footle.club/custom/${params.slug}`,
      siteName: 'Footle',
      images: [{ url: '/og-image.png' }],
    },
    twitter: {
      title,
      description,
      images: ['/og-image.png'],
      card: 'summary_large_image',
    },
  };
}

export default function CustomGamePage({ params }: Props) {
  return <CustomGameClient slug={params.slug} />;
}

