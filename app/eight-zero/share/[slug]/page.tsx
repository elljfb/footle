import type { Metadata } from 'next';
import EightZeroShareClient from './EightZeroShareClient';
import { getWorldCupShareBySlug } from '../../../../services/eightZeroShareService';
import { getEightZeroDisplaySummary, getEightZeroOutcomeTitle } from '../../../../lib/eight-zero-share-format';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = (await params) as { slug: string };
  const slug = resolvedParams.slug;
  const share = await getWorldCupShareBySlug(slug);
  const title = share ? getEightZeroOutcomeTitle(share) : `Shared 8-0 World Cup result`;
  const description = share
    ? getEightZeroDisplaySummary(share)
    : 'See this 8-0 World Cup run and compare your squad to the world.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://footle.club/eight-zero/share/${slug}`,
      siteName: 'Footle',
      images: [
        {
          url: `/eight-zero/share/${slug}/og`,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [`/eight-zero/share/${slug}/og`],
      card: 'summary_large_image',
    },
  };
}

export default async function EightZeroSharePage({ params }: Props) {
  const resolvedParams = (await params) as { slug: string };
  return <EightZeroShareClient slug={resolvedParams.slug} />;
}
