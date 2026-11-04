import type { Metadata } from 'next';
import Link from 'next/link';
import GeneratorTool from '../football-generators/GeneratorTool';
import { FOOTBALL_PLAYER_DETAILS, FOOTBALL_PLAYERS } from '../../lib/football-generators';

const pageUrl = '/random-football-player-generator';
const title = 'Random Football Player Generator';
const description = 'Generate a random football player from thousands of names in the Footle player database. Discover a footballer, start a quiz or share a pick with friends.';

export const metadata: Metadata = {
  title: 'Random Football Player Generator | Footle',
  description,
  keywords: ['random football player generator', 'football player picker', 'random soccer player generator', 'random footballer'],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Random Football Player Generator | Footle',
    description,
    url: `https://footle.club${pageUrl}`,
    siteName: 'Footle',
    type: 'website',
    images: [{ url: '/random-football-player-generator/opengraph-image', width: 1200, height: 630, alt: 'Footle random football player generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Football Player Generator | Footle',
    description,
    images: ['/random-football-player-generator/opengraph-image'],
  },
};

const faqs = [
  { question: 'How does the random football player generator work?', answer: 'Each time you generate, Footle randomly selects a name from the player database used by its football games.' },
  { question: 'Can I use the random player for a quiz?', answer: 'Yes. Use the pick for a football quiz, guessing game, debate, team selection or any other football challenge.' },
  { question: 'Can I share a player pick?', answer: 'Yes. Copy the result and link, use your device’s share menu, or share it to X.' },
];

export default function RandomFootballPlayerGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: title,
        description,
        url: `https://footle.club${pageUrl}`,
        applicationCategory: 'EntertainmentApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        publisher: { '@type': 'Organization', name: 'Footle', url: 'https://footle.club' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <header className="space-y-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">Free football tool</p>
        <h1 className="text-4xl font-bold text-white md:text-5xl">Random Football Player Generator</h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-300">
          Pick a footballer at random from Footle&apos;s database of more than 2,600 players. Each result includes
          their current listed team, playing position and age, giving you a ready-made pick for a football quiz,
          player guessing game or challenge with friends.
        </p>
      </header>
      <GeneratorTool
        title="Pick a random football player"
        description="Generate a footballer and see their team, position and age. Copy the details or share your pick."
        itemLabel="Player"
        items={FOOTBALL_PLAYERS}
        itemDetails={FOOTBALL_PLAYER_DETAILS}
        pageUrl={pageUrl}
      />

      <section className="space-y-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-300">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How the random player picker works</h2>
          <p className="leading-7">
            The player picker draws from the names in Footle&apos;s football database. Every result includes the
            player&apos;s listed club and position, plus their age calculated from their date of birth. Generate
            again for another footballer, or copy and share the complete result.
          </p>
          <p className="leading-7">
            Use the random footballer for a quiz, a who-am-I guessing game, a draft, a debate or a challenge with
            friends. With players from multiple clubs, leagues and positions, the generator makes it easy to find a
            name when you want football inspiration without choosing one yourself.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>
          {faqs.map(({ question, answer }) => (
            <div key={question}>
              <h3 className="font-semibold text-white">{question}</h3>
              <p className="mt-1 leading-7">{answer}</p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          Want to try more? Browse our <Link href="/football-generators" className="font-semibold text-[#03E690] hover:text-emerald-300">football generators</Link> or play the <Link href="/" className="font-semibold text-[#03E690] hover:text-emerald-300">daily Footle player quiz</Link>.
        </p>
      </section>
    </div>
  );
}
