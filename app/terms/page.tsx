import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using Footle football games, quizzes and website services.',
  alternates: { canonical: '/terms' },
};

export default function TermsOfServicePage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">Legal</p>
        <h1 className="text-4xl font-black tracking-tight text-white">Terms of Service</h1>
        <p className="text-gray-400">Last updated: 22 October 2026</p>
      </header>
      <div className="space-y-7 leading-7 text-gray-300">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-white">Using Footle</h2>
          <p>
            These terms apply when you access or use the Footle website and its football games. By using the site, you agree to these
            terms. If you do not agree, please do not use the site. Footle provides its games for personal, non-commercial
            entertainment, subject to these terms and applicable law.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-white">Games and availability</h2>
          <p>
            We aim to keep the games available and accurate, but features, puzzle data and availability may change or be interrupted.
            We do not guarantee uninterrupted access, error-free operation, or that game data will always be complete or current.
            Your game progress may be stored in your browser and can be lost if browser data is cleared.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-white">Acceptable use</h2>
          <p>
            You must not misuse the site, interfere with its operation, attempt to gain unauthorised access to its systems, or use
            automated methods in a way that disrupts the service. Do not submit unlawful, abusive or misleading material to public
            features such as leaderboards or shared challenges.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-white">User submissions and shared content</h2>
          <p>
            You are responsible for content you submit, including leaderboard names and custom game details. Do not submit content
            that infringes another person&apos;s rights or violates the law. We may remove submissions or restrict access to features
            where reasonably necessary to protect users or the service.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-white">Third-party services and links</h2>
          <p>
            The site may use third-party services or link to external websites. Those services are governed by their own terms and
            privacy notices. We are not responsible for third-party content, services or availability.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-white">Intellectual property</h2>
          <p>
            The Footle name, branding, website design and original site content are protected by applicable intellectual property
            laws. These terms do not transfer ownership to you. Football names, clubs and related references belong to their
            respective owners and are used for identification and informational purposes.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-white">Disclaimer and liability</h2>
          <p>
            To the extent permitted by law, the site is provided “as is” without warranties that cannot be excluded by law. Nothing
            in these terms limits liability where doing so would be unlawful, including liability for fraud or for death or personal
            injury caused by negligence. Otherwise, to the extent permitted by law, Footle is not liable for indirect or
            consequential loss arising from use of the site.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-white">Changes and contact</h2>
          <p>
            We may update these terms as the site changes. The updated version will be posted on this page with a revised date.
            Questions about these terms can be sent to{' '}
            <a href="mailto:dailyguessthefootballer@gmail.com" className="font-semibold text-[#03E690] hover:text-emerald-300">
              dailyguessthefootballer@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}
