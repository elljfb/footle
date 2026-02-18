"use client";

import Link from 'next/link';
import { useState } from 'react';
import { LEAGUE_OPTIONS } from '../lib/leagues';

const leagues = [
  { slug: '', name: 'All Players' },
  ...LEAGUE_OPTIONS,
];

interface LeagueMenuProps {
  className?: string;
}

export default function LeagueMenu({ className = '' }: LeagueMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="absolute -left-2 -top-2 w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full text-white z-50"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="absolute -left-2 mt-12 bg-gray-900 border border-gray-700 rounded shadow-lg w-56 p-2 z-50">
          {leagues.map(league => (
            <Link
              key={league.slug}
              href={league.slug ? `/league/${league.slug}` : '/'}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-800 text-white"
            >
              {league.name}
            </Link>
          ))}
          <div className="my-1 border-t border-gray-700" />
          <Link
            href="/custom"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded hover:bg-gray-800 text-white"
          >
            Create Custom Game
          </Link>
        </div>
      )}
    </div>
  );
}
