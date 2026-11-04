import type { Metadata } from 'next';
import CustomGameClient from './CustomGameClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugLabel = slug.replace(/-/g, ' ');
  const title = `Footle Custom - ${slugLabel}`;
  const description = 'Play a shared custom Footle challenge.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://footle.club/custom/${slug}`,
      siteName: 'Footle',
      images: [{ url: `/custom/${slug}/opengraph-image` }],
    },
    twitter: {
      title,
      description,
      images: [`/custom/${slug}/opengraph-image`],
      card: 'summary_large_image',
    },
  };
}

export default async function CustomGamePage({ params }: Props) {
  const { slug } = await params;

  return <CustomGameClient slug={slug} />;
}
