import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PlayerOfTheSeasonShareClient from './PlayerOfTheSeasonShareClient';
import {
  getPlayerOfTheSeasonShareBySlug,
  getPlayerOfTheSeasonShareText,
} from '../../../../services/playerOfTheSeasonShareService';
import { getSeasonSummaryLabel } from '../../../../lib/player-of-the-season';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const share = await getPlayerOfTheSeasonShareBySlug(slug);

  if (!share) {
    return {
      title: 'Shared Premier League season',
      description: 'See this created player’s Premier League season results.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${share.player_build.name} - ${getSeasonSummaryLabel(share.season, share.player_build.age)}`;
  const description = getPlayerOfTheSeasonShareText(share.player_build, share.season);
  const url = `https://footle.club/player-of-the-season/share/${slug}`;
  const image = `/player-of-the-season/share/${slug}/og`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Footle',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PlayerOfTheSeasonSharePage({ params }: Props) {
  const { slug } = await params;
  const share = await getPlayerOfTheSeasonShareBySlug(slug);
  if (!share) notFound();

  return <PlayerOfTheSeasonShareClient share={share} />;
}
