'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AdvertiseModal from './AdvertiseModal';

export default function Footer() {
  const [showAdvertise, setShowAdvertise] = useState(false);

  return (
    <>
      <div ta-ad-container=""></div>
      <footer className="border-t border-gray-800 bg-gray-950/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="Footle home" className="inline-block">
              <Image
                src="/footle-logo-main.png"
                alt="Footle"
                width={220}
                height={80}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">
              Free football games, daily quizzes and puzzles for fans who know the beautiful game.
            </p>
          </div>
          <FooterColumn title="Explore Footle" links={[
            { href: '/games', label: 'All games' },
            { href: '/articles', label: 'Football articles' },
            { href: '/archive', label: 'Footle archive' },
            { href: '/custom', label: 'Create a custom game' },
          ]} />
          <FooterColumn title="Popular games" links={[
            { href: '/', label: 'Footle' },
            { href: '/league/premier-league', label: 'Premier League Guess' },
            { href: '/grid', label: 'Football Grid' },
            { href: '/eight-zero', label: '8-0 World Cup Draft' },
            { href: '/career', label: 'Career Mode' },
          ]} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Useful links</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="transition-colors hover:text-[#03E690]">About Footle</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-[#03E690]">Privacy policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-[#03E690]">Terms of service</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-[#03E690]">Contact us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 px-4 py-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Footle. All rights reserved.
        </div>
      </footer>

      <AdvertiseModal
        isOpen={showAdvertise}
        onClose={() => setShowAdvertise(false)}
      />
    </>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-gray-400">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} prefetch={false} className="transition-colors hover:text-[#03E690]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
