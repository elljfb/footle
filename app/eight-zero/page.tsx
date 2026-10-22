import type { Metadata } from 'next';
import EightZeroClient from './EightZeroClient';
import GamePageContent from '../../components/GamePageContent';

export const metadata: Metadata = {
  title: '8-0 - World Cup Draft Game',
  description:
    'Play 8-0, the Footle World Cup draft mode. Build an XI from random World Cup squads, simulate the tournament, and try to go undefeated.',
  alternates: {
    canonical: '/eight-zero',
  },
  openGraph: {
    title: '8-0 - World Cup Draft Game',
    description: 'Draft a World Cup XI and chase an undefeated tournament run.',
    url: 'https://footle.club/eight-zero',
    siteName: 'Footle',
    images: [{ url: '/eight-zero/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '8-0 - World Cup Draft Game',
    description: 'Build a World Cup XI from random countries and years, then simulate the full path to the final.',
    images: ['/eight-zero/opengraph-image'],
  },
};

export default function EightZeroPage() {
  return (
    <>
      <EightZeroClient />
      <GamePageContent
        title="Build a World Cup XI and take on the tournament"
        introduction={[
          '8-0 is a football draft and tournament game. Choose a formation, build an XI from World Cup squads and send your team through a simulated competition. The aim is to make smart selections across the pitch and chase the perfect eight-win run.',
          'Your choices shape the team you take into the tournament. Think about how the players fit together and balance the positions in your chosen formation, rather than focusing only on the biggest names.',
        ]}
        sections={[
          {
            heading: 'From formation to final',
            paragraphs: [
              'Begin by choosing a formation and setting the era range for the eligible player pool. Draft players into the available positions, review the completed side, then start the tournament simulation to see how your XI performs through the group stage and knockout rounds.',
              'The match results make each run different, so a strong draft is not a guarantee of a perfect campaign. Adjust your formation and selections on another run to see how a different tactical approach changes the challenge.',
            ],
          },
        ]}
        faqs={[
          { question: 'What does 8-0 mean?', answer: 'It represents the game’s goal of building a strong side and chasing a perfect, undefeated tournament run.' },
          { question: 'Can I choose my own formation?', answer: 'Yes. Select from the available formations before drafting your World Cup XI.' },
          { question: 'What can I customise before drafting?', answer: 'You can adjust the formation and the range of World Cup eras used for the eligible player pool, then draft from the options shown.' },
        ]}
      />
    </>
  );
}
