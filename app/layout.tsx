import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Footer from "../components/Footer";
import LeagueMenu from '../components/LeagueMenu';

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
        url: '/opengraph-image',
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
    images: ['/opengraph-image'],
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
  const serviceWorkerScript = process.env.NODE_ENV === 'production'
    ? `
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
    `
    : `
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(async function(registrations) {
          await Promise.all(registrations.map(function(registration) {
            return registration.unregister();
          }));
          const cachesToClear = (await caches.keys()).filter(function(name) {
            return name.startsWith('footle-');
          });
          await Promise.all(cachesToClear.map(function(name) {
            return caches.delete(name);
          }));
        }).catch(function(error) {
          console.error('Failed to clean up the Footle service worker in development:', error);
        });
      }
    `;

  return (
    <html lang="en">
      <body className="font-sans">
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6766680365418435"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script src="https://cdn.apitiny.net/scripts/v2.0/main.js" data-site-id="6a54bd92ccbb498d7565666d" data-test-mode="false" strategy="afterInteractive"/>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QVKN2HSME2" strategy="afterInteractive" />
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="GWe1ck+IGWGAt1z4pak/og" strategy="afterInteractive" />
        <Script id="analytics-and-service-worker" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QVKN2HSME2');

            ${serviceWorkerScript}
          `}
        </Script>
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
