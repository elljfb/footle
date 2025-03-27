import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from "../components/Footer";

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111827',
};

export const metadata: Metadata = {
  title: 'Footle - The Daily Football Player Guessing Game',
  description: 'Test your football knowledge by guessing today\'s mystery player. Get feedback on position, age, nationality, club, and more with each guess. Play daily!',
  keywords: 'football, soccer, guessing game, daily game, player quiz, football quiz',
  authors: [{ name: 'Footle' }],
  metadataBase: new URL('https://footle.online'),
  openGraph: {
    title: 'Footle - The Daily Football Player Guessing Game',
    description: 'Test your football knowledge by guessing today\'s mystery player. Get feedback on position, age, nationality, club, and more with each guess. Play daily!',
    type: 'website',
    url: 'https://footle.online',
    siteName: 'Footle',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Footle - The Daily Football Player Guessing Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footle - The Daily Football Player Guessing Game',
    description: 'Test your football knowledge by guessing today\'s mystery player. Get feedback on position, age, nationality, club, and more with each guess. Play daily!',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  robots: 'index, follow',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Footle",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QVKN2HSME2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QVKN2HSME2');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
