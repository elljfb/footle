import type { Metadata } from 'next';
import ShirtNumberQuizClient from './ShirtNumberQuizClient';
import { createPremierLeagueShirtNumberQuestions } from '../../lib/premier-league-shirt-numbers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Premier League Shirt Number Quiz | Footle',
  description:
    'Can you name the Premier League player from their club, season, and squad number? Take the five-question shirt number quiz.',
  alternates: {
    canonical: '/shirt-number-quiz',
  },
  openGraph: {
    title: 'Premier League Shirt Number Quiz | Footle',
    description: 'Name the player from their Premier League club, season, and squad number.',
    url: 'https://footle.club/shirt-number-quiz',
    siteName: 'Footle',
    type: 'website',
    images: [{ url: '/shirt-number-quiz/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premier League Shirt Number Quiz | Footle',
    description: 'Name the player from their Premier League club, season, and squad number.',
    images: ['/shirt-number-quiz/opengraph-image'],
  },
};

export default function ShirtNumberQuizPage() {
  const challengeDate = new Date().toISOString().slice(0, 10);
  const questions = createPremierLeagueShirtNumberQuestions(challengeDate);

  return (
    <>
      <ShirtNumberQuizClient challengeDate={challengeDate} questions={questions} />
      <section className="mt-12 space-y-5 rounded-lg border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">About the Premier League Shirt Number Quiz</h2>
          <p>
            Identify the player who wore a particular squad number for a Premier League club in a given season.
            Each quiz has five questions, with four former squad members to choose from.
          </p>
          <p>
            Questions are drawn from Premier League squad number history. Seasons where more than one player
            wore the same number for the same club are left out so every question has a single correct answer.
          </p>
        </div>
      </section>
    </>
  );
}
