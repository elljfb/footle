'use client';

import Link from 'next/link';
import { useState } from 'react';
import AdvertiseModal from './AdvertiseModal';

export default function Footer() {
  const [showAdvertise, setShowAdvertise] = useState(false);

  return (
    <>
      <footer className="py-4 text-center text-sm text-gray-500">
        <button
          onClick={() => setShowAdvertise(true)}
          className="transition-colors hover:text-gray-700"
          type="button"
        >
          Advertise
        </button>
        {' | '}
        <Link href="/privacy" className="hover:text-gray-700">
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
