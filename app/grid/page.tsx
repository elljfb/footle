import type { Metadata } from 'next';
import FootballGridClient from './FootballGridClient';

export const metadata: Metadata = {
  title: 'Football Grid - Daily Football Immaculate Grid',
  description:
    'Play Football Grid, a daily 3x3 football immaculate grid where you guess players from club, league, and nationality clues.',
  alternates: {
    canonical: '/grid',
  },
  openGraph: {
    title: 'Football Grid - Daily Football Immaculate Grid',
    description: 'Fill a 3x3 football grid with players who match each club, league, or nationality pairing.',
    url: 'https://footle.club/grid',
    siteName: 'Footle',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Football Grid - Daily Football Immaculate Grid',
    description: 'Guess the players who match each daily club, league, or nationality square.',
    images: ['/og-image.png'],
  },
};

export default function GridPage() {
  return <FootballGridClient />;
}
