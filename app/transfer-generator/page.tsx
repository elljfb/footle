import type { Metadata } from 'next';
import TransferGeneratorClient from './TransferGeneratorClient';

export const metadata: Metadata = {
  title: 'Fake Football Transfer Maker - Random Transfer Generator',
  description:
    'Use the Footle fake football transfer maker to create random transfer rumours, fake transfer news, and shareable transfer rumour templates in one click.',
  keywords: [
    'fake football transfer maker',
    'random transfer generator',
    'fake transfer news',
    'fake transfer rumors',
    'random transfer',
    'transfer rumor template',
  ],
  alternates: {
    canonical: '/transfer-generator',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Fake Football Transfer Maker - Random Transfer Generator',
    description:
      'Generate random transfer rumours and fake football transfer news to share with friends.',
    url: 'https://footle.club/transfer-generator',
    siteName: 'Footle',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Footle fake football transfer maker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fake Football Transfer Maker | Random Transfer Generator',
    description:
      'Create fake football transfer rumors and random transfer news to share in seconds.',
    images: ['/og-image.png'],
  },
};

export default function TransferGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Footle Transfer Generator',
    description:
      'A fake football transfer maker and random transfer generator for creating shareable transfer rumours.',
    url: 'https://footle.club/transfer-generator',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web',
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
      <TransferGeneratorClient />
      <section className="mt-12 space-y-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Fake Football Transfer Maker</h2>
          <p>
            Footle Transfer Generator is a fake football transfer maker built for fans who want instant transfer chaos.
            Generate a made-up move, random fee, and fake transfer news line in one click, then share it with friends.
          </p>
          <p>
            It works as a random transfer generator, a fake transfer rumor tool, and a simple transfer rumor template
            for social posts, group chats, and football banter.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How The Random Transfer Generator Works</h2>
          <p>
            Each time you generate a result, the tool picks a player, an interested club, a transfer phrase, a fee,
            and a source line to create a fresh piece of fake transfer news. The result is designed to feel close enough
            to real rumor formatting to be funny and instantly shareable.
          </p>
          <p>
            You can use it as a random transfer rumour generator, a fake football headline maker, or a quick way to
            create transfer posts when the real news cycle goes quiet.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">More Than Just Fake Transfer Rumours</h2>
          <p>
            If you found Footle through the transfer generator, there is more to play on the site too. The main Footle
            game is a daily football guessing challenge, and there are also league-specific modes, archive mode, career
            mode, and custom games to explore.
          </p>
        </div>
      </section>
    </>
  );
}
