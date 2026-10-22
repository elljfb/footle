import type { Metadata } from 'next';
import FootballGridClient from './FootballGridClient';
import GamePageContent from '../../components/GamePageContent';

export const metadata: Metadata = {
  title: 'Football Grid - Daily Football Immaculate Grid',
  description:
    'Play Football Grid, a daily 3x3 football immaculate grid where you guess players from club, league, and nationality clues.',
  alternates: {
    canonical: '/grid',
  },
  openGraph: {
    title: 'Football Grid - Daily Football Immaculate Grid',
    description: 'Fill a 3x3 football grid with players who match each club, league, or nationality pairing.',
    url: 'https://footle.club/grid',
    siteName: 'Footle',
    images: [{ url: '/grid/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Football Grid - Daily Football Immaculate Grid',
    description: 'Guess the players who match each daily club, league, or nationality square.',
    images: ['/grid/opengraph-image'],
  },
};

export default function GridPage() {
  return (
    <>
      <FootballGridClient />
      <GamePageContent
        title="A daily football immaculate grid"
        introduction={[
          'Football Grid is a daily 3 × 3 football trivia challenge. Each square combines a row clue with a column clue, and your task is to name a player who fits both. The categories can point to clubs, leagues or nationalities, rewarding fans who can connect different parts of the game.',
          'A strong answer is not just a player you recognise: it must satisfy the exact combination shown for that cell. Take a moment to check both clues before submitting, and use the remaining squares to explore different players and football connections.',
        ]}
        sections={[
          {
            heading: 'Think across the grid',
            paragraphs: [
              'Start with the row and column labels that feel most familiar, then consider players whose careers link the two categories. A footballer who played for a certain club and represented a particular nation may fit; a player who meets only one condition will not complete the square.',
              'Try to use the full board to test how broadly you remember clubs, leagues and international teams. The daily grid makes a compact challenge whether you play alone or compare answers with friends.',
            ],
          },
        ]}
        faqs={[
          { question: 'How does Football Grid work?', answer: 'Fill the daily 3 × 3 board by entering a footballer who matches both the row and column clues for a selected square.' },
          { question: 'Can one player be used more than once?', answer: 'Each answer is submitted for a particular square. The game checks that response against that cell’s clue combination.' },
          { question: 'Does Football Grid reset every day?', answer: 'A new daily grid challenge is available each day. Your in-progress board is saved in your browser for the current challenge.' },
        ]}
      />
    </>
  );
}
