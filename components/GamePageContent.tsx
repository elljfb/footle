'use client';

import Link from 'next/link';

export interface GamePageFaq {
  question: string;
  answer: string;
}

interface GamePageSection {
  heading: string;
  paragraphs: string[];
}

interface GamePageContentProps {
  title?: string;
  introduction?: string[];
  sections?: GamePageSection[];
  faqs: GamePageFaq[];
}

export default function GamePageContent({
  title,
  introduction = [],
  sections = [],
  faqs,
}: GamePageContentProps) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <section className="mt-12 space-y-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-300 sm:p-8">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      {(title || introduction.length > 0) && (
        <div className="space-y-3">
          {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
          {introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      )}

      {sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="text-xl font-bold text-white">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}

      <section className="space-y-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#03E690]">Good to know</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Frequently asked questions</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white marker:hidden">
                {question}
                <span aria-hidden="true" className="shrink-0 text-xl text-[#03E690] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-7 text-gray-400">{answer}</p>
            </details>
          ))}
        </div>
        <p className="border-t border-gray-800 pt-4 text-sm text-gray-400">
          Looking for another challenge? Browse the <Link href="/games" className="font-semibold text-[#03E690] hover:text-emerald-300">Footle game collection</Link> or
          try <Link href="/grid" className="ml-1 font-semibold text-[#03E690] hover:text-emerald-300">Football Grid</Link>.
        </p>
      </section>
    </section>
  );
}
