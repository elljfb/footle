import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Football Games & Quizzes',
  description: 'Explore every free Footle football game: daily player quizzes, Premier League guessing, Football Grid, Career Mode, 8-0 and more.',
  alternates: { canonical: '/games' },
};

const games = [
  { href: '/', title: 'Footle', label: 'Daily player quiz', description: 'Find the mystery footballer using clues about their club, nationality, position, age and more.' },
  { href: '/league/premier-league', title: 'Premier League Guess', label: 'League daily', description: 'Put your Premier League player knowledge to the test in a league-focused daily puzzle.' },
  { href: '/grid', title: 'Football Grid', label: 'Daily grid', description: 'Fill each square in a 3 × 3 football grid with players who fit the row and column clues.' },
  { href: '/career', title: 'Career Mode', label: 'Career path quiz', description: 'Identify a footballer from the clubs, appearances and goals in their career history.' },
  { href: '/eight-zero', title: '8-0', label: 'World Cup draft', description: 'Draft a World Cup starting XI and see how far your team can go in the tournament.' },
  { href: '/squadle', title: 'Squadle', label: 'Starting XI quiz', description: 'Use a squad blueprint to work out which club the starting eleven represents.' },
  { href: '/recall', title: 'Footle Recall', label: 'Memory challenge', description: 'Study a footballer profile, then rely on your memory to choose the right player.' },
  { href: '/archive', title: 'Footle Archive', label: 'Past daily puzzles', description: 'Return to recent Footle daily puzzles and keep your football quiz streak going.' },
  { href: '/custom', title: 'Custom games', label: 'Make a challenge', description: 'Create a football guessing game of your own and share it with friends.' },
];

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">The Footle games collection</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Football games for every kind of fan</h1>
        <p className="max-w-3xl text-lg leading-8 text-gray-300">
          Whether you know every Premier League squad or love a tricky football trivia challenge, there is a Footle puzzle for you.
          Play a quick daily game, explore a player&apos;s career, or challenge friends with a custom quiz.
        </p>
      </header>
      <section aria-label="All Footle games" className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <Link key={game.href} href={game.href} prefetch={false} className="group rounded-2xl border border-gray-800 bg-gray-900/70 p-5 transition-all hover:-translate-y-0.5 hover:border-[#03E690]/60 hover:bg-gray-800">
            <p className="text-xs font-bold uppercase tracking-wider text-[#03E690]">{game.label}</p>
            <h2 className="mt-2 text-xl font-bold text-white group-hover:text-[#03E690]">{game.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">{game.description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-gray-200">Play now <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </section>
      <section className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <h2 className="text-2xl font-bold text-white">A new football challenge every day</h2>
        <p className="mt-3 leading-7 text-gray-300">
          Footle brings together daily football quizzes built around different kinds of knowledge: player attributes, club history,
          squad recognition and tournament tactics. Games are free to play in your browser, and you can choose the format that suits
          your football expertise.
        </p>
        <Link href="/articles/how-to-play-football-guessing-games" className="mt-4 inline-block font-semibold text-[#03E690] hover:text-emerald-300">
          Read our guide to football guessing games →
        </Link>
      </section>
    </div>
  );
}
