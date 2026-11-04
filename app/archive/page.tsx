import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ArchiveClient from './ArchiveClient';

export const metadata: Metadata = {
  title: 'Footle Archive - Play The Last 30 Days',
  description: 'Play Footle puzzles from the previous 30 days. Pick a date from the archive and keep going day by day.',
  openGraph: {
    title: 'Footle Archive - Play The Last 30 Days',
    description: 'Play Footle puzzles from the previous 30 days.',
    url: 'https://footle.club/archive',
    siteName: 'Footle',
    images: [{ url: '/archive/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footle Archive - Play The Last 30 Days',
    description: 'Play Footle puzzles from the previous 30 days.',
    images: ['/archive/opengraph-image'],
  },
};

export default function ArchivePage() {
  return (
    <Suspense fallback={null}>
      <ArchiveClient />
    </Suspense>
  );
}
