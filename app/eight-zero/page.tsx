import type { Metadata } from 'next';
import EightZeroClient from './EightZeroClient';

export const metadata: Metadata = {
  title: '8-0 - World Cup Draft Game',
  description:
    'Play 8-0, the Footle World Cup draft mode. Build an XI from random World Cup squads, simulate the tournament, and try to go undefeated.',
  alternates: {
    canonical: '/eight-zero',
  },
  openGraph: {
    title: '8-0 - World Cup Draft Game',
    description: 'Draft a World Cup XI and chase an undefeated tournament run.',
    url: 'https://footle.club/eight-zero',
    siteName: 'Footle',
    images: [{ url: '/8-0-og.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '8-0 - World Cup Draft Game',
    description: 'Build a World Cup XI from random countries and years, then simulate the full path to the final.',
    images: ['/8-0-og.jpg'],
  },
};

export default function EightZeroPage() {
  return <EightZeroClient />;
}
