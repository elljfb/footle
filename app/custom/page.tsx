import type { Metadata } from 'next';
import CustomCreateClient from './CustomCreateClient';

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
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Custom Footle Challenge',
    description: 'Create and share your own Footle challenge.',
    images: ['/og-image.png'],
  },
};

export default function CustomPage() {
  return <CustomCreateClient />;
}
