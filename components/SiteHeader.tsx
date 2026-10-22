'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navigation = [
  { href: '/', label: 'Footle' },
  { href: '/games', label: 'Games' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 bg-gray-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Footle home" className="shrink-0">
          <Image
            src="/footle-logo-main.png"
            alt="Footle"
            width={240}
            height={80}
            priority
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-[#03E690]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="ml-2 rounded-lg bg-[#03E690] px-4 py-2 text-sm font-bold text-gray-950 transition-colors hover:bg-emerald-300"
          >
            Play today
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-700 text-gray-100 hover:border-[#03E690] hover:text-[#03E690] md:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-gray-800 px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 sm:px-2">
            {[...navigation, { href: '/archive', label: 'Archive' }, { href: '/custom', label: 'Create a custom game' }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-[#03E690]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
