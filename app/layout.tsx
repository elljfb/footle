import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Footer from "../components/Footer";
import SiteHeader from '../components/SiteHeader';
import PopularGamesSidebar from '../components/PopularGamesSidebar';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111827',
};

export const metadata: Metadata = {
  title: {
    default: 'Footle — The Daily Football Player Guessing Game',
    template: '%s | Footle',
  },
  description: 'Test your football knowledge by guessing today\'s mystery player. Get feedback on position, age, nationality, club, and more with each guess. Play daily!',
  keywords: 'football, soccer, guessing game, daily game, player quiz, football quiz, football wordle, football game, football wordle game',
  authors: [{ name: 'Footle' }],
  metadataBase: new URL('https://footle.club'),
  openGraph: {
    title: 'Footle — The Daily Football Player Guessing Game',
    description: 'Test your football knowledge by guessing today\'s mystery player. Get feedback on position, age, nationality, club, and more with each guess. Play daily!',
    type: 'website',
    url: 'https://footle.club',
    siteName: 'Footle',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Footle — The daily football player guessing game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footle — The Daily Football Player Guessing Game',
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
          `}
        </Script>
        <div className="min-h-screen bg-gray-900 text-white">
          <SiteHeader />
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-w-0">{children}</div>
              <div className="lg:pt-2">
                <PopularGamesSidebar />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
