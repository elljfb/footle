import type { Metadata } from 'next';
import LeagueClient from './LeagueClient';
import { LEAGUE_OPTIONS, slugToLeagueName } from '../../../lib/leagues';

export async function generateMetadata({ params }: { params: { league?: string } }): Promise<Metadata> {
  const slug = params?.league;
  const leagueName = slug ? (slugToLeagueName[slug] ?? decodeURIComponent(slug)) : undefined;

  const title = leagueName ? `Footle — Guess The ${leagueName} player` : 'Footle - The Daily Football Player Guessing Game';
  const description = leagueName
    ? `Try to guess today's mystery ${leagueName} player. Get feedback on position, age, nationality, club and more.`
    : 'Test your football knowledge by guessing today\'s mystery football player. Get feedback on position, age, nationality, club, and more with each guess.';

  const url = slug ? `https://footle.club/league/${slug}` : 'https://footle.club/';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
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

// Pre-render known league pages at build time for fast static loading and crawlers.
export async function generateStaticParams() {
  const slugs = LEAGUE_OPTIONS.map((league) => league.slug);
  return slugs.map((league) => ({ league }));
}

export default function Page({ params }: { params: { league?: string } }) {
  const slug = params?.league;

  return <LeagueClient slug={slug} />;
}
