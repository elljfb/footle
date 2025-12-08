import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from "../components/Footer";
import LeagueMenu from '../components/LeagueMenu';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111827',
};

export const metadata: Metadata = {
  title: 'Footle - The Daily Football Player Guessing Game',
  description: 'Test your football knowledge by guessing today\'s mystery player. Get feedback on position, age, nationality, club, and more with each guess. Play daily!',
  keywords: 'football, soccer, guessing game, daily game, player quiz, football quiz, football wordle, football game, football wordle game',
  authors: [{ name: 'Footle' }],
  metadataBase: new URL('https://footle.club'),
  openGraph: {
    title: 'Footle - The Daily Football Player Guessing Game',
    description: 'Test your football knowledge by guessing today\'s mystery player. Get feedback on position, age, nationality, club, and more with each guess. Play daily!',
    type: 'website',
    url: 'https://footle.club',
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QVKN2HSME2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QVKN2HSME2');
              
              // Register service worker for PWA
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
          <div className="max-w-3xl mx-auto relative">
            <LeagueMenu />
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
