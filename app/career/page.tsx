import type { Metadata } from 'next';
import CareerClient from './CareerClient';

export const metadata: Metadata = {
  title: 'Football Career Path Quiz - Guess The Player Career Path',
  description: 'Play Footle Career, a daily football career path quiz where you guess the mystery player from their clubs, appearances, and goals in just 3 guesses.',
  keywords: [
    'football career path quiz',
    'guess the footballer career path',
    'guess the player career',
    'football quiz career path',
    'soccer career path game',
    'daily football quiz',
    'football trivia game',
    'guess the footballer clubs',
    'career path football game',
    'Footle Career',
  ],
  alternates: {
    canonical: '/career',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Football Career Path Quiz | Guess The Player Career Path',
    description: 'Guess the mystery footballer from their career path, club history, appearances, and goals. A new Footle Career puzzle every day.',
    url: 'https://footle.club/career',
    siteName: 'Footle',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Footle Career - football career path quiz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Football Career Path Quiz | Guess The Player Career Path',
    description: 'Play the daily football career path quiz and guess the mystery player in 3 guesses.',
    images: ['/career_og_image.png'],
  },
};

export default function CareerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: 'Footle Career',
    description:
      'A daily football career path quiz where players guess the mystery footballer from their club history, appearances, and goals.',
    url: 'https://footle.club/career',
    applicationCategory: 'Game',
    genre: ['Sports Game', 'Trivia Game', 'Word Game'],
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
      <CareerClient />
      <section className="mt-12 space-y-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">What Is Footle Career?</h2>
          <p>
            Footle Career is a daily football career path quiz. Instead of guessing a player from position, club, and nationality,
            you work backwards through the clubs they played for and try to identify the mystery footballer from their career history.
          </p>
          <p>
            Each puzzle shows club spells in order, along with appearances and goals, turning the game into a football trivia challenge
            for fans who know transfers, loans, breakout seasons, and iconic career moves.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How To Play The Football Career Path Quiz</h2>
          <p>
            You get one new football career path puzzle each day and three guesses to solve it. The game starts by revealing the first
            two clubs in the player&apos;s senior career. After every wrong guess, another club is revealed to help narrow down the answer.
          </p>
          <p>
            Because each clue also includes appearances and goals, you can use more than just club names. A short loan spell, a huge goal
            tally, or a final transfer to a different league can be the giveaway that helps you solve the player career path.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Why Footle Career Is Different</h2>
          <p>
            Most daily football quiz games focus on current squads or player attributes. Footle Career is built around football career
            history, which makes it feel closer to a true footballer career quiz. It rewards fans who remember where a player started,
            which clubs they joined on loan, and how their career developed over time.
          </p>
          <p>
            That means the same puzzle can appeal to casual players, transfer-market obsessives, and long-time football fans who enjoy
            testing their memory of club journeys across the Premier League, LaLiga, Serie A, Bundesliga, Ligue 1, and beyond.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Who This Daily Football Quiz Is For</h2>
          <p>
            If you enjoy guessing the footballer, football trivia games, soccer quiz games, or career mode style challenges, Footle Career
            gives you a fresh daily puzzle with a different angle. It is especially good for players who already know the obvious stars and
            want a football guessing game that relies more on memory and football knowledge than pure current-form awareness.
          </p>
        </div>
      </section>
    </>
  );
}
