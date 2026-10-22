import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Footle',
  description: 'Contact the Footle team about football games, feedback, privacy requests, advertising or partnerships.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">Get in touch</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Contact us</h1>
        <p className="text-lg leading-8 text-gray-300">
          Have a question about a game, spotted an issue, or want to discuss advertising or a partnership?
          Send the Footle team a message.
        </p>
      </header>

      <ContactForm />

      <section className="space-y-3 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <h2 className="text-xl font-bold text-white">Prefer to email us directly?</h2>
        <p className="leading-7 text-gray-300">
          Write to{' '}
          <a
            href="mailto:dailyguessthefootballer@gmail.com"
            className="font-semibold text-[#03E690] underline decoration-[#03E690]/40 underline-offset-4 hover:text-emerald-300"
          >
            dailyguessthefootballer@gmail.com
          </a>
          . For game issues, include the game name and what happened so we can understand the problem.
        </p>
        <p className="text-sm leading-6 text-gray-400">
          Privacy and data requests can also be sent to this address. Please avoid including passwords or other sensitive information.
        </p>
      </section>
    </main>
  );
}
