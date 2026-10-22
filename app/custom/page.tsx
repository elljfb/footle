import type { Metadata } from 'next';
import CustomCreateClient from './CustomCreateClient';
import GamePageContent from '../../components/GamePageContent';

export const metadata: Metadata = {
  title: 'Create Custom Footle Challenge',
  description: 'Build your own Footle game: choose leagues, pick a mystery player, and share a custom challenge link with friends.',
  alternates: {
    canonical: '/custom',
  },
  openGraph: {
    title: 'Create Custom Footle Challenge',
    description: 'Choose leagues, set a target player, and share your own Footle challenge link.',
    url: 'https://footle.club/custom',
    siteName: 'Footle',
    images: [{ url: '/custom/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Custom Footle Challenge',
    description: 'Create and share your own Footle challenge.',
    images: ['/custom/opengraph-image'],
  },
};

export default function CustomPage() {
  return (
    <>
      <CustomCreateClient />
      <GamePageContent
        title="Make a football guessing challenge of your own"
        introduction={[
          'Custom Footle lets you build a player guessing challenge and send it to friends. Choose the eligible leagues and target footballer, then share the generated link so others can test their knowledge against your selection.',
          'It is a flexible way to turn a favourite player, a surprising transfer or a football debate into a quick quiz. Players open the challenge in their browser and use the familiar Footle clues to work toward the answer.',
        ]}
        sections={[
          {
            heading: 'Create, share and play',
            paragraphs: [
              'Set up your challenge by following the options in the creator. Check the selected player and league range before you share the link, especially if you want the answer to be possible from the clues available to your friends.',
              'Custom challenges are separate from the daily puzzle, so creating one does not replace today’s Footle. You can also browse the archive or other game modes whenever you want a ready-made challenge.',
            ],
          },
        ]}
        faqs={[
          { question: 'How do I create a custom Footle game?', answer: 'Open the custom game creator, choose the permitted league or leagues and a target player, then create the shareable challenge.' },
          { question: 'Can my friends play the custom challenge?', answer: 'Yes. Share the challenge link with them so they can open and play your custom game.' },
          { question: 'Does a custom game affect the daily puzzle?', answer: 'No. A custom challenge is separate from the daily Footle game and its personal statistics.' },
        ]}
      />
    </>
  );
}
