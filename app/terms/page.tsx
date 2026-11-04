import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Footle',
  description: 'Read the terms for using Footle games, generators, and other features.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Use | Footle',
    description: 'Read the terms for using Footle games, generators, and other features.',
    url: 'https://footle.club/terms',
    siteName: 'Footle',
    images: [{ url: '/terms/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Use | Footle',
    description: 'Read the terms for using Footle games, generators, and other features.',
    images: ['/terms/opengraph-image'],
  },
};

const updatedDate = 'November 4, 2026';

export default function TermsPage() {
  return (
    <main className="space-y-8 pt-10 text-gray-200">
      <header className="text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-blue-300">Footle</p>
        <h1 className="mb-4 text-4xl font-bold text-white">Terms of Use</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          These terms explain the basic rules for using Footle and its games.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <h2 className="text-2xl font-bold text-white">Using Footle</h2>
        <p>
          By using Footle, you agree to use the site lawfully and not to disrupt, damage, or attempt to gain
          unauthorized access to the site, its services, or other users&apos; data.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <h2 className="text-2xl font-bold text-white">Games and user content</h2>
        <p>
          Footle provides football games, generators, and related features for personal entertainment. Game
          results and generated content may be random or based on available data, and are not guaranteed to be
          complete, current, or error-free.
        </p>
        <p>
          If you submit a score, create a custom challenge, or share a result, you are responsible for the
          content you provide. Do not submit unlawful, abusive, misleading, or otherwise harmful content.
          Shared content may be accessible to anyone with its link.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <h2 className="text-2xl font-bold text-white">Availability and changes</h2>
        <p>
          We may update, suspend, or discontinue any part of Footle at any time. We may also update these
          terms; continued use of the site after an update means you accept the revised terms.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <h2 className="text-2xl font-bold text-white">Disclaimer</h2>
        <p>
          Footle is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without guarantees that the
          service will always be available, uninterrupted, or free of errors. To the extent permitted by law,
          Footle is not liable for indirect or consequential loss arising from your use of the site.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <h2 className="text-2xl font-bold text-white">Contact</h2>
        <p>
          Questions about these terms? Contact us at{' '}
          <a className="text-blue-300 hover:text-blue-200" href="mailto:dailyguessthefootballer@gmail.com">
            dailyguessthefootballer@gmail.com
          </a>.
        </p>
        <p className="text-sm text-gray-400">Last updated: {updatedDate}</p>
      </section>
    </main>
  );
}
