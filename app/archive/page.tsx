import { Suspense } from 'react';
import type { Metadata } from 'next';
import ArchiveClient from './ArchiveClient';

export const metadata: Metadata = {
  title: 'Footle Archive - Play The Last 30 Days',
  description: 'Play Footle puzzles from the previous 30 days. Pick a date from the archive and keep going day by day.',
};

export default function ArchivePage() {
  return (
    <Suspense fallback={null}>
      <ArchiveClient />
    </Suspense>
  );
}
