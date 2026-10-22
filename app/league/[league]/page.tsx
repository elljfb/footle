import type { Metadata } from 'next';
import LeagueClient from './LeagueClient';
import { LEAGUE_OPTIONS, slugToLeagueName } from '../../../lib/leagues';
import GamePageContent from '../../../components/GamePageContent';

export async function generateMetadata({ params }: { params: Promise<{ league?: string }> }): Promise<Metadata> {
  const { league: slug } = await params;
  const leagueName = slug ? (slugToLeagueName[slug] ?? decodeURIComponent(slug)) : undefined;

  const title = leagueName ? `Footle - Guess The ${leagueName} player` : 'Footle - The Daily Football Player Guessing Game';
  const description = leagueName
    ? `Try to guess today's mystery ${leagueName} player. Get feedback on position, age, nationality, club and more.`
    : 'Test your football knowledge by guessing today\'s mystery football player. Get feedback on position, age, nationality, club, and more with each guess.';

  const url = slug ? `https://footle.club/league/${slug}` : 'https://footle.club/';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Footle',
      images: [{ url: `/league/${slug}/opengraph-image` }],
    },
    twitter: {
      title,
      description,
      images: [`/league/${slug}/opengraph-image`],
      card: 'summary_large_image',
    },
  };
}

// Pre-render known league pages at build time for fast static loading and crawlers.
export async function generateStaticParams() {
  const slugs = LEAGUE_OPTIONS.map((league) => league.slug);
  return slugs.map((league) => ({ league }));
}

export default async function Page({ params }: { params: Promise<{ league?: string }> }) {
  const { league: slug } = await params;
  const leagueName = slug ? (slugToLeagueName[slug] ?? decodeURIComponent(slug)) : 'football';

  return (
    <>
      <LeagueClient slug={slug} />
      <GamePageContent
        title={`Play the daily ${leagueName} football quiz`}
        introduction={[
          `This Footle league challenge focuses on players from ${leagueName}. Use each guess to compare player details and identify the mystery footballer. The league-specific format is useful if you follow a particular competition closely or want to test your knowledge of its current squads.`,
          'The feedback is designed to help you reason your way toward the answer. Check which attributes are confirmed, which are close and which do not fit, then choose a player who can test your next best theory.',
        ]}
        sections={[
          {
            heading: `A focused ${leagueName} player guessing game`,
            paragraphs: [
              `A league-filtered puzzle gives you a more focused challenge than the main daily game. Think about likely positions, nationalities and clubs together: a player in the right competition but the wrong club can still point you toward the next useful guess.`,
              'You do not need to know every squad member to enjoy the game. The clues are there to help casual fans and dedicated supporters alike, and every attempt provides another piece of information.',
            ],
          },
          {
            heading: 'More ways to test your football knowledge',
            paragraphs: [
              'After today’s league puzzle, try a different competition from the Footle menu, take on Football Grid or follow a player’s club history in Career Mode. Each format draws on a different part of your football knowledge.',
            ],
          },
        ]}
        faqs={[
          { question: `How many guesses do I get in the ${leagueName} game?`, answer: `The daily ${leagueName} player quiz gives you up to five guesses to identify the mystery player.` },
          { question: 'Are my guesses limited to this league?', answer: 'Yes. This version focuses the answer and valid player guesses on the selected league, so use the league and club clues to narrow down candidates.' },
          { question: 'How often does the league puzzle update?', answer: 'A new daily league puzzle is made available each day. You can also switch to another league or play the main Footle puzzle.' },
        ]}
      />
    </>
  );
}
