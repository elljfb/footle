'use client';

import Link from 'next/link';
import { useState } from 'react';
import AdvertiseModal from './AdvertiseModal';

export default function Footer() {
  const [showAdvertise, setShowAdvertise] = useState(false);

  return (
    <>
      <footer className="py-4 text-center text-sm text-gray-500">
        <Link href="/about" prefetch={false} className="hover:text-gray-700">
          About
        </Link>
        {' | '}
        <Link href="https://buymeacoffee.com/footle" className="hover:text-gray-700">
          Buy us a Coffee ☕
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
