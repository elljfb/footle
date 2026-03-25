import type { Metadata } from 'next';
import GridClient from './GridClient';
import { getGridPuzzle, getGridPuzzleNumber } from '../../services/gridGameService';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Football Immaculate Grid Game - Footle Grid',
  description:
    'Play Footle Grid, a daily football immaculate grid style game where you fill a 3x3 club grid with players who played for both teams.',
  keywords: [
    'football immaculate grid',
    'soccer immaculate grid',
    'football grid game',
    'daily football grid',
    'guess the football player grid',
    'club crossover football quiz',
    'Footle Grid',
  ],
  alternates: {
    canonical: '/grid',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Football Immaculate Grid Game | Footle Grid',
    description:
      'Fill the 3x3 football club grid with players who played for both teams. A new Footle Grid puzzle every day.',
    url: 'https://footle.club/grid',
    siteName: 'Footle',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Footle Grid - football immaculate grid game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Football Immaculate Grid Game | Footle Grid',
    description:
      'Play the daily football grid and fill each square with a player who played for both clubs.',
    images: ['/og-image.png'],
  },
};

export default function GridPage() {
  const initialPuzzle = getGridPuzzle();
  const puzzleNumber = getGridPuzzleNumber();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: 'Footle Grid',
    description:
      'A daily football immaculate grid style game where players fill a 3x3 grid using footballers who played for both clubs in each square.',
    url: 'https://footle.club/grid',
    applicationCategory: 'Game',
    genre: ['Sports Game', 'Trivia Game', 'Puzzle Game'],
    inLanguage: 'en',
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'Footle',
      url: 'https://footle.club',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GridClient initialPuzzle={initialPuzzle} puzzleNumber={puzzleNumber} />
      <section className="mt-12 space-y-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">What Is Footle Grid?</h2>
          <p>
            Footle Grid is a daily football immaculate grid style challenge. You get a 3x3 board with three clubs across the top
            and three clubs down the side, and every square needs a player who represented both clubs.
          </p>
          <p>
            It rewards transfer knowledge, memory for loans, and those random club crossovers that football fans somehow never forget.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How To Play The Daily Football Grid</h2>
          <p>
            Select a square, type a player name, and lock in a footballer who played for both clubs in that intersection. Once you use
            a player correctly, they cannot be used again elsewhere in the grid.
          </p>
          <p>
            You have 12 total guesses to complete all 9 squares, so every miss matters. A perfect run means finding club links quickly
            without wasting attempts on players who only fit one side of the square.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Why This Football Grid Is Fun</h2>
          <p>
            The best football grid games sit somewhere between trivia, transfer history, and pure football obsession. Footle Grid gives
            you those same crossover puzzles in a daily format that fits right alongside the main Footle game and Career Mode.
          </p>
          <p>
            Some squares are obvious, others are all about recalling forgotten loans, academy moves, or short spells that only proper
            football sickos will remember.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Who Footle Grid Is For</h2>
          <p>
            If you enjoy football quiz games, soccer trivia, immaculate grid style puzzles, and guessing players from club history,
            Footle Grid gives you a fresh daily challenge built around club overlap instead of positions or current squads.
          </p>
        </div>
      </section>
    </>
  );
}
