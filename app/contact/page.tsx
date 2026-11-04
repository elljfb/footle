import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Footle',
  description: 'Get in touch with the Footle team about the games, your feedback, or a question.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Footle',
    description: 'Get in touch with the Footle team.',
    url: 'https://footle.club/contact',
    siteName: 'Footle',
    images: [{ url: '/contact/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Footle',
    description: 'Get in touch with the Footle team.',
    images: ['/contact/opengraph-image'],
  },
};

export default function ContactPage() {
  return (
    <main className="space-y-8 pt-10 text-gray-200">
      <header className="text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-blue-300">We&apos;re listening</p>
        <h1 className="mb-4 text-4xl font-bold text-white">Contact Footle</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          Have feedback, spotted a problem, or have a question? Send us an email.
        </p>
      </header>

      <section className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Email us</h2>
        <p>
          For general questions, feedback, or support, contact the Footle team at:
        </p>
        <a
          className="inline-block font-semibold text-blue-300 hover:text-blue-200"
          href="mailto:dailyguessthefootballer@gmail.com"
        >
          dailyguessthefootballer@gmail.com
        </a>
      </section>
    </main>
  );
}
