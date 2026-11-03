import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Football Generators: Random Player & Team',
  description: 'Try free football generators from Footle. Pick a random football player or club, discover someone new, and share your result with friends.',
  alternates: { canonical: '/football-generators' },
  openGraph: {
    title: 'Football Generators: Random Player & Team | Footle',
    description: 'Generate a random football player or team for quizzes, debates, games and football inspiration.',
    url: 'https://footle.club/football-generators',
    siteName: 'Footle',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Football Generators | Footle',
    description: 'Pick a random football player or club with Footle’s free generators.',
  },
};

const generators = [
  {
    href: '/random-football-player-generator',
    title: 'Random Football Player Generator',
    description: 'Pick a footballer at random from Footle’s player database. Use the result for a quiz, a debate, a challenge or just to discover a player.',
    label: 'Generate a player',
  },
  {
    href: '/random-football-team-generator',
    title: 'Random Football Team Generator',
    description: 'Get a random club from the teams represented in Footle’s player database. Great for choosing a team, starting a challenge or sparking a football conversation.',
    label: 'Generate a team',
  },
];

export default function FootballGeneratorsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Football Generators',
    description: 'Free random football player and football team generators.',
    url: 'https://footle.club/football-generators',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: generators.map((generator, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: generator.title,
        url: `https://footle.club${generator.href}`,
      })),
    },
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <header className="space-y-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">Free football tools</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Football Generators</h1>
        <p className="max-w-3xl text-lg leading-8 text-gray-300">
          Need a random footballer for a quiz or a club to build a challenge around? Use Footle’s free football generators
          to get an instant pick, then share it with friends.
        </p>
      </header>

      <section aria-label="Football generators" className="grid gap-4 sm:grid-cols-2">
        {generators.map((generator) => (
          <Link
            key={generator.href}
            href={generator.href}
            prefetch={false}
            className="group rounded-2xl border border-gray-800 bg-gray-900/70 p-6 transition-all hover:-translate-y-0.5 hover:border-[#03E690]/60 hover:bg-gray-800"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[#03E690]">Free random generator</p>
            <h2 className="mt-3 text-2xl font-bold text-white group-hover:text-[#03E690]">{generator.title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">{generator.description}</p>
            <span className="mt-5 inline-block text-sm font-semibold text-gray-200">
              {generator.label} <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <h2 className="text-2xl font-bold text-white">How to use the football generators</h2>
        <p className="leading-7 text-gray-300">
          Choose a player or team generator and press the button for a new random result. The player picker uses names
          from the football database behind Footle, while the team picker uses the clubs represented in that data.
          Copy a pick or share it directly to start a quiz, make a selection or challenge another football fan.
        </p>
      </section>
    </div>
  );
}
