import { Suspense } from 'react';
import type { Metadata } from 'next';
import ArchiveClient from './ArchiveClient';
import GamePageContent from '../../components/GamePageContent';

export const metadata: Metadata = {
  title: 'Footle Archive - Play The Last 30 Days',
  description: 'Play Footle puzzles from the previous 30 days. Pick a date from the archive and keep going day by day.',
  alternates: {
    canonical: '/archive',
  },
  openGraph: {
    title: 'Footle Archive - Play The Last 30 Days',
    description: 'Play recent daily Footle football player puzzles from the archive.',
    url: 'https://footle.club/archive',
    siteName: 'Footle',
    images: [{ url: '/archive/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footle Archive - Play The Last 30 Days',
    description: 'Play recent daily Footle football player puzzles from the archive.',
    images: ['/archive/opengraph-image'],
  },
};

export default function ArchivePage() {
  return (
    <>
      <Suspense fallback={null}>
        <ArchiveClient />
      </Suspense>
      <GamePageContent
        title="Play past Footle puzzles"
        introduction={[
          'The Footle Archive lets you return to recent daily player puzzles when you want another round. Choose an available date and play the challenge using the same player clues and guessing rules as the daily game.',
          'Archive mode is a good way to practise reading attribute feedback, compare your approach across different puzzles or catch up on a day you missed. It keeps the familiar Footle format while letting you choose which recent challenge to play.',
        ]}
        sections={[
          {
            heading: 'How the daily archive works',
            paragraphs: [
              'Select a date from the available archive and follow the game prompts. Each puzzle is tied to its own day, so the answer and your guesses belong to that selected challenge rather than changing the current daily game.',
              'Your past game results and personal statistics are stored in your browser. Clearing browser storage can remove locally saved progress, so keep that in mind if you want to preserve your history.',
            ],
          },
        ]}
        faqs={[
          { question: 'How far back can I play?', answer: 'The Footle Archive offers recent puzzles from the last 30 days, subject to the dates available in the archive.' },
          { question: 'Does archive play replace today’s Footle?', answer: 'No. Archive mode is a separate way to play past daily puzzles and does not change the current daily challenge.' },
          { question: 'Can I play a puzzle more than once?', answer: 'You can revisit dates that are available in the archive. Your saved progress may be restored by your browser for a puzzle you have already started.' },
        ]}
      />
    </>
  );
}
