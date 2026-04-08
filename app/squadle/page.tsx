import type { Metadata } from 'next';
import SquadBlueprintClient from '../squad-blueprint/SquadBlueprintClient';

export const metadata: Metadata = {
  title: 'Squadle: The Daily Starting XI Guessing Game',
  description:
    'Play Squadle, the daily starting XI guessing game where you identify the football club from flags, ages, positions, and lineup clues.',
  alternates: {
    canonical: '/squadle',
  },
  openGraph: {
    title: 'Squadle: The Daily Starting XI Guessing Game',
    description: 'A daily football club guessing game built around a clue-based starting XI layout.',
    url: 'https://footle.club/squadle',
    siteName: 'Footle',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Squadle: The Daily Starting XI Guessing Game',
    description: 'Guess the football club from a clue-based starting XI with flags, ages, and positions.',
    images: ['/og-image.png'],
  },
};

export default function SquadlePage() {
  return (
    <>
      <SquadBlueprintClient />
      <section className="mt-12 space-y-5 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">What Is Squadle?</h2>
          <p>
            It&apos;s a deduction game built from the player data already in Footle. Instead of guessing a single footballer,
            you read a club&apos;s miniature squad blueprint and work out which team fits the clues.
          </p>
          <p>
            The board shows the shape of a starting XI and reveals only a handful of players. Each revealed clue is deliberately
            stripped back to the essentials, so the puzzle feels closer to recognising a squad identity than spotting one obvious name.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Why It Works</h2>
          <p>
            The mode is designed to feel like a logic puzzle. Fans who know their squads can recognise a player from age,
            nationality, and position almost instantly, then connect the names back to the right club.
          </p>
          <p>
            It also rewards broader football knowledge. Even when one clue is not enough on its own, the combination of shape,
            role, and nationality can quickly narrow the answer down to a small set of realistic clubs.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How To Read The Blueprint</h2>
          <p>
            Start with the formation shape first, then use the revealed flags and ages to test your instinct. A left winger from one
            country, an older central midfielder from another, and a certain full-back profile can often point to one club faster than
            any single clue by itself.
          </p>
        </div>
      </section>
    </>
  );
}
