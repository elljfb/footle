import type { Metadata } from 'next';
import MemoryClient from './MemoryClient';

export const metadata: Metadata = {
  title: 'Footle Recall - Football Player Memory Game',
  description:
    'Play Footle Recall, an unlimited football player memory game where you memorise player stats, then choose the right footballer from similar options.',
  alternates: {
    canonical: '/recall',
  },
  openGraph: {
    title: 'Footle Recall - Football Player Memory Game',
    description:
      'Memorise football player stats for five seconds, then pick the right player from ten similar options.',
    url: 'https://footle.club/recall',
    siteName: 'Footle',
    type: 'website',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footle Recall - Football Player Memory Game',
    description:
      'A fast football memory quiz built from Footle player data.',
    images: ['/og-image.png'],
  },
};

export default function RecallPage() {
  return (
    <>
      <MemoryClient />
      <section className="mt-12 space-y-5 rounded-lg border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">What Is Footle Recall?</h2>
          <p>
            Footle Recall is an unlimited football memory game. Each round shows a mystery player profile for five seconds,
            then hides the stats and asks you to identify the player from ten close statistical matches.
          </p>
          <p>
            The decoys are selected from position, role, age, height, league, nationality, and foot data, so the answer
            list should feel plausible rather than random.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How Scoring Works</h2>
          <p>
            A correct answer scores 10 points. Wrong answers earn decimal points from the visible stat matches:
            position, role, age, nationality, league, height, and foot all contribute, with age and height fading by distance.
            Five rounds make a maximum score of 50.
          </p>
        </div>
      </section>
    </>
  );
}
