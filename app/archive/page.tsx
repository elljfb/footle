import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
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
          'The Footle Archive lets you replay the 30 daily player puzzles immediately before today. Choose a date to load that day’s mystery player, then use the same searchable player list, eight attribute clues and ten-guess limit as the main game.',
          'The newest archive entry is yesterday’s puzzle; today’s challenge remains on the Footle home page. This makes the archive useful for catching up on a missed day, revisiting a tricky answer or practising how to interpret the feedback without replacing your current daily game.',
        ]}
        sections={[
          {
            heading: 'Choose a date and play its puzzle',
            paragraphs: [
              'Use the date picker to choose one of the available days. The selected date is shown with its puzzle number, and the mystery player is the one assigned to that original date. Submit valid player names and compare position, sub-position, age, nationality, club, league, height and preferred foot after every guess.',
              'Read the whole result before choosing your next player. Green marks an exact match; orange indicates a defined near match, such as an age within three years, a height within five centimetres or a different club in the same league. Grey means the attribute does not match. Arrows on age and height show which direction the mystery player is in.',
              'Each archive date has its own saved game state in your browser. Switching between dates lets you continue a puzzle you already started without mixing its guesses with another day. Clearing your browser storage can remove this saved progress.',
            ],
          },
          {
            heading: 'Use the archive to practise deduction',
            paragraphs: [
              'Rather than guessing a succession of famous names, treat each turn as a small test. Keep exact matches as anchors, use close matches to build a shortlist and make your next guess help resolve more than one open question. The age and height arrows are especially useful for ruling out candidates that are on the wrong side of a value.',
              'The player data is maintained and may not reflect every recent transfer or squad change. Guesses must match a name in the available player list, so an absent player cannot be entered as an answer.',
            ],
          },
        ]}
        faqs={[
          { question: 'Which dates are available in the Footle Archive?', answer: 'The archive includes the 30 daily puzzles immediately before today, from yesterday back through the previous 30-day window.' },
          { question: 'Does archive play replace today’s Footle?', answer: 'No. The archive is separate from today’s challenge, which remains available on the Footle home page.' },
          { question: 'Does each archived puzzle have separate progress?', answer: 'Yes. Progress is saved separately for each archive date in your browser, so you can switch dates and return to an earlier puzzle. Clearing browser storage removes this local progress.' },
          { question: 'Do archive puzzles use the same rules as Footle?', answer: 'Yes. Each archived puzzle uses the same player list, eight attribute clues and ten-guess limit as the main Footle game.' },
        ]}
      />
      <p className="mt-6 border-t border-gray-800 pt-6 text-sm text-gray-400">
        Want a closer look at the clue system? Read our{' '}
        <Link href="/articles/reading-player-clues-in-footle" className="font-semibold text-[#03E690] hover:text-emerald-300">
          guide to reading player clues in Footle
        </Link>
        .
      </p>
    </>
  );
}
