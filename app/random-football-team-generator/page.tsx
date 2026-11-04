import type { Metadata } from 'next';
import Link from 'next/link';
import GeneratorTool from '../football-generators/GeneratorTool';
import { FOOTBALL_TEAM_DETAILS, FOOTBALL_TEAMS } from '../../lib/football-generators';

const pageUrl = '/random-football-team-generator';
const title = 'Random Football Team Generator';
const description = 'Generate a random football team from clubs in the Footle player database. Pick a club for a quiz, challenge, career save or a bit of football inspiration.';

export const metadata: Metadata = {
  title: 'Random Football Team Generator | Footle',
  description,
  keywords: ['random football team generator', 'random soccer team generator', 'random football club generator', 'football team picker'],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Random Football Team Generator | Footle',
    description,
    url: `https://footle.club${pageUrl}`,
    siteName: 'Footle',
    type: 'website',
    images: [{ url: '/random-football-team-generator/opengraph-image', width: 1200, height: 630, alt: 'Footle random football team generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Football Team Generator | Footle',
    description,
    images: ['/random-football-team-generator/opengraph-image'],
  },
};

const faqs = [
  { question: 'How does the random football team generator work?', answer: 'The generator randomly picks one of the unique club names represented in the Footle player database and shows its league.' },
  { question: 'Can I use this to choose a team for a challenge?', answer: 'Yes. Generate a club for a football quiz, career save, watch-along challenge, debate or game with friends.' },
  { question: 'Which league does a generated team play in?', answer: 'Each result includes the league associated with that club in the Footle player database.' },
  { question: 'Can I share my random team?', answer: 'Yes. Copy the result and link, use the share menu on your device, or post it to X.' },
];

export default function RandomFootballTeamGeneratorPage() {
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
        <h1 className="text-4xl font-bold text-white md:text-5xl">Random Football Team Generator</h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-300">
          Get a random football club in one click. This free football team picker selects from clubs in the Footle
          database and shows each team&apos;s league, making it easy to choose a club for a quiz, career challenge,
          watch-along or friendly debate.
        </p>
      </header>
      <GeneratorTool
        title="Pick a random football team"
        description="Generate a club from the Footle database and see its league. Copy your result or share your pick with friends."
        itemLabel="Team"
        items={FOOTBALL_TEAMS}
        itemDetails={FOOTBALL_TEAM_DETAILS}
        pageUrl={pageUrl}
      />

      <section className="space-y-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-300">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How the random team picker works</h2>
          <p className="leading-7">
            The generator uses the clubs represented in Footle&apos;s football player database. Press the button to
            draw a club at random; its league appears with the result. Generate again for a different pick, or copy
            and share the team to get your challenge started.
          </p>
          <p className="leading-7">
            Use a random club to set up a football trivia round, choose a team for a career save, pick a side to follow
            for a match or settle a group chat debate. The team list brings together clubs from the leagues covered
            by Footle&apos;s player data.
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
          Explore more <Link href="/football-generators" className="font-semibold text-[#03E690] hover:text-emerald-300">football generators</Link> or take on the <Link href="/" className="font-semibold text-[#03E690] hover:text-emerald-300">daily Footle quiz</Link>.
        </p>
      </section>
    </div>
  );
}
