'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';
import AdvertiseModal from './AdvertiseModal';

export default function Footer() {
  const [showAdvertise, setShowAdvertise] = useState(false);

  return (
    <>
      <Script
        src="https://cdn.tinysnippet.net/scripts/v2.0/manager.js"
        strategy="afterInteractive"
      />
      <footer className="py-4 text-center text-sm text-gray-500">
        <iframe
          width="100%"
          height={100}
          frameBorder={0}
          className="ta-widget"
          data-min-height="100"
          id="widget6a54db0b60578d41d1e5237f-seed1504"
          title="Advertisement"
          src="https://app.tinyadz.com/widgets/6a54db0b60578d41d1e5237f?seed=1504&previewMode=false&showInPopup=false&theme=light"
        />
        <Link href="/about" prefetch={false} className="hover:text-gray-700">
          About
        </Link>
        {' | '}
        <Link href="/privacy" prefetch={false} className="hover:text-gray-700">
          Privacy Policy
        </Link>
      </footer>

      <AdvertiseModal
        isOpen={showAdvertise}
        onClose={() => setShowAdvertise(false)}
      />
    </>
  );
}
