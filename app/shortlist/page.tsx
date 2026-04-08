import type { Metadata } from 'next';
import FilterHuntClient from '../filter-hunt/FilterHuntClient';

export const metadata: Metadata = {
  title: 'Shortlist: Football Player Elimination Challenge',
  description:
    'Play Shortlist, the football player elimination challenge where you clear a 20-player board using league, age, position, nationality, and other clues.',
  alternates: {
    canonical: '/shortlist',
  },
  openGraph: {
    title: 'Shortlist: Football Player Elimination Challenge',
    description: 'A fast football player elimination game where every instruction helps narrow the shortlist.',
    url: 'https://footle.club/shortlist',
    siteName: 'Footle',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shortlist: Football Player Elimination Challenge',
    description: 'Follow the football filters, eliminate the board, and leave just one player standing.',
    images: ['/og-image.png'],
  },
};

export default function ShortlistPage() {
  return (
    <>
      <FilterHuntClient />
      <section className="mt-12 space-y-5 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-gray-200">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">What Is Shortlist?</h2>
          <p>
            It&apos;s a reverse guessing game built around elimination. You start with 20 players, then chip away at the board using
            age, league, position, nationality, height, and foot clues.
          </p>
          <p>
            Instead of typing an answer immediately, you solve the puzzle by reading the player pool and removing every card that matches
            the current rule. The pace comes from how quickly you can scan the board and trust the data in front of you.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Why It Works</h2>
          <p>
            The mode is quick, tactile, and surprisingly strategic. You are not typing guesses, you are reading the board and
            removing the players that do not fit until the final name is obvious.
          </p>
          <p>
            Because the rules are generated from real player attributes already stored in Footle, the challenge feels grounded in football
            knowledge rather than random trivia. A strong run is all about processing leagues, roles, and player profiles under pressure.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">How To Play It Well</h2>
          <p>
            The best approach is to focus only on the live instruction and clear the board methodically. One clean pass through the cards
            is often faster than second-guessing, especially once the pool gets small and the final survivor starts to emerge.
          </p>
        </div>
      </section>
    </>
  );
}
