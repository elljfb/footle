import type { Metadata } from 'next';
import CustomGameClient from './CustomGameClient';
import GamePageContent from '../../../components/GamePageContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugLabel = slug.replace(/-/g, ' ');
  const title = `Footle Custom - ${slugLabel}`;
  const description = 'Play a shared custom Footle challenge.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://footle.club/custom/${slug}`,
      siteName: 'Footle',
      images: [{ url: `/custom/${slug}/opengraph-image` }],
    },
    twitter: {
      title,
      description,
      images: [`/custom/${slug}/opengraph-image`],
      card: 'summary_large_image',
    },
  };
}

export default async function CustomGamePage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <CustomGameClient slug={slug} />
      <GamePageContent
        faqs={[
          { question: 'What is a custom Footle challenge?', answer: 'It is a player guessing puzzle created by another Footle user and shared with a unique link.' },
          { question: 'Can I replay a shared custom challenge?', answer: 'The challenge is opened from its shared link. Progress and availability depend on the challenge settings and your browser storage.' },
          { question: 'Where can I play the daily Footle game?', answer: 'Visit the Footle home page to play the current daily player guessing puzzle.' },
        ]}
      />
    </>
  );
}
