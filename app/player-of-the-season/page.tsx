import type { Metadata } from 'next';
import PlayerOfTheSeasonClient from './PlayerOfTheSeasonClient';
import GamePageContent from '../../components/GamePageContent';

export const metadata: Metadata = {
  title: 'Player of the Season',
  description: 'Create your own Premier League footballer, choose a club, distribute attribute points and simulate a full season to see if you win Player of the Season.',
  alternates: {
    canonical: '/player-of-the-season',
  },
  openGraph: {
    title: 'Player of the Season',
    description: 'Build a footballer, pick your Premier League club and simulate a season to see if you become Player of the Season.',
    url: 'https://footle.club/player-of-the-season',
    siteName: 'Footle',
    images: [{ url: '/player-of-the-season/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Player of the Season',
    description: 'Design, simulate and share your Premier League season story.',
    images: ['/player-of-the-season/opengraph-image'],
  },
};

export default function PlayerOfTheSeasonPage() {
  return (
    <>
      <PlayerOfTheSeasonClient />
      <GamePageContent
        title="Build a footballer and chase the Premier League title"
        introduction={[
          'The Player of the Season game gives you the creative side of football management without the spreadsheet overload. Pick your player, spread 420 attribute points across six key stats, choose a club and read the simulated season outcome.',
          'This mode is built around the team-performance data already in the project and turns it into a quick, replayable single-season challenge. It rewards smart builds, sensible club fit and a strong understanding of where your player is most likely to thrive.',
        ]}
        sections={[
          {
            heading: 'Why the club matters',
            paragraphs: [
              'The game uses each club’s squad quality, positional strength, depth and competition for places to estimate minutes, performance and title challenge. A high-quality side might create more chances but also force a player to fight harder for their place. A smaller club might offer more starts but fewer top-end chances.',
            ],
          },
          {
            heading: 'How the build affects the season',
            paragraphs: [
              'Pace, shooting, passing, dribbling, defending and physical are the six core stats. A winger thrives on dribbling and pace, a striker needs shooting and physicality, while a midfielder often benefits from passing and dribbling control. Your player’s position and attributes help determine selection, minutes, match ratings and goal contributions across the season.',
            ],
          },
          {
            heading: 'Awards to chase',
            paragraphs: [
              'The major individual awards are the Golden Boot, Golden Playmaker and Player of the Season. For each season, the Golden Boot goal target and Golden Playmaker assist target are independently drawn from historical Premier League top-scorer and top-assist totals, with each recorded season equally likely. Player of the Season is reserved for an outstanding campaign combining appearances, match ratings and decisive contributions. Your season status, such as Regular starter or Ever-present, describes your role and is not an award.',
            ],
          },
        ]}
        faqs={[
          { question: 'How do I build my player?', answer: 'Choose a name, age from 16 to 40, preferred foot, position, club and then distribute 420 attribute points across pace, shooting, passing, dribbling, defending and physical.' },
          { question: 'Is this a full 38-match season?', answer: 'Yes. Start the season and follow your club’s Premier League fixture in each of the 38 matchweeks, including your player’s appearances, minutes, ratings and goal contributions. The final screen includes all club results and the completed league table.' },
          { question: 'What awards and season labels can my player earn?', answer: 'The major individual awards are the Golden Boot, Golden Playmaker and Player of the Season. The targets for the Golden Boot and Golden Playmaker are independently drawn for each simulated season from historical Premier League season-winning totals: 18–36 goals and 10–21 assists. Your season status is separate from awards: standout young players may be called a Potential wonderkid or have a Breakthrough season, while experienced players may earn labels such as Veteran leader or Elder statesman.' },
          { question: 'Can I share my final season?', answer: 'Yes. Choose Share result to save the season and open a unique public result page with its own preview image and link.' },
          { question: 'Can I replay with different builds?', answer: 'Yes. After the final match, choose Build another player to adjust the attributes, position or club and simulate a new season.' },
        ]}
      />
    </>
  );
}
