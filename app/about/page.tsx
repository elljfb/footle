import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Footle - Daily Football Guessing Games',
  description:
    'Learn more about Footle, the daily football guessing game with player, league, career, squad, archive, and custom football quiz modes.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Footle',
    description:
      'Footle is a collection of daily football guessing games built for fans who enjoy player knowledge, transfers, squads, and deduction puzzles.',
    url: 'https://footle.club/about',
    siteName: 'Footle',
    type: 'website',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Footle',
    description:
      'Learn more about Footle, the daily football guessing game and its football quiz modes.',
    images: ['/og-image.png'],
  },
};

const gameModes = [
  {
    href: '/',
    title: 'Footle',
    description:
      'Guess the daily mystery footballer from clues like position, age, nationality, club, league, height, and foot.',
    accent: 'border-blue-500/30 text-blue-200',
  },
  {
    href: '/career',
    title: 'Career Mode',
    description:
      'Work out the player from their club history, appearances, goals, loans, and transfer path.',
    accent: 'border-emerald-500/30 text-emerald-200',
  },
  {
    href: '/squadle',
    title: 'Squadle',
    description:
      'Read a starting XI blueprint and identify the club from the shape of the squad.',
    accent: 'border-cyan-500/30 text-cyan-200',
  },
  {
    href: '/shortlist',
    title: 'Shortlist',
    description:
      'Clear a 20-player board by following football filters until one player remains.',
    accent: 'border-rose-500/30 text-rose-200',
  },
  {
    href: '/archive',
    title: 'Archive',
    description:
      'Catch up on recent daily Footle puzzles and keep playing beyond today.',
    accent: 'border-yellow-500/30 text-yellow-200',
  },
  {
    href: '/custom',
    title: 'Custom Games',
    description:
      'Create a football guessing challenge and share it with friends.',
    accent: 'border-fuchsia-500/30 text-fuchsia-200',
  },
];

export default function AboutPage() {
  return (
    <main className="space-y-8 pt-10">
      <header className="text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-blue-300">
          About Footle
        </p>
        <h1 className="mb-4 text-4xl font-bold text-white">
          Daily football puzzles for people who know the game
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          Footle is a football guessing game built around the little details fans remember:
          current clubs, career paths, squad shapes, positions, nationalities, and transfer clues.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <h2 className="text-2xl font-bold text-white">What Footle Is</h2>
        <p>
          The main game gives you one mystery footballer each day and ten guesses to solve it.
          After every guess, the board tells you which details are correct, close, or wide of the mark,
          so every attempt gives you a better read on the answer.
        </p>
        <p>
          Around that daily puzzle, Footle has grown into a set of football quiz modes for different
          kinds of fans. Some modes reward current squad knowledge, some test transfer memory, and
          others turn football data into quick deduction challenges.
        </p>
      </section>

      <section className="space-y-5 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <div className="space-y-2 text-gray-200">
          <h2 className="text-2xl font-bold text-white">Ways To Play</h2>
          <p>
            Each mode keeps the same quick daily feel, but asks you to think about football from a
            slightly different angle.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {gameModes.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className={`rounded-xl border bg-gray-950/50 p-4 transition-all hover:-translate-y-0.5 hover:bg-gray-800 ${mode.accent}`}
            >
              <h3 className="font-semibold text-white">{mode.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{mode.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <h2 className="text-2xl font-bold text-white">How It Is Built</h2>
        <p>
          Footle is designed to be simple to open, play, and share. Your personal results and game
          progress are kept in your browser, while leaderboard entries are only submitted when you
          choose to send a score.
        </p>
        <p>
          The puzzles use football player data to create fair clues without making the experience
          feel like a spreadsheet. The aim is always the same: a quick daily challenge that rewards
          instinct, memory, and one more guess than you planned to take.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Start With Today&apos;s Puzzle</h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-300">
          New puzzles are available daily, and the archive is there when one game is not enough.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Play Footle
          </Link>
          <Link
            href="/archive"
            className="rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
          >
            View Archive
          </Link>
        </div>
      </section>
    </main>
  );
}
