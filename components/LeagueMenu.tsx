"use client";

import Link from 'next/link';
import { useState } from 'react';

const leagues = [
  { slug: '', name: 'All Players' },
  { slug: 'premier-league', name: 'Premier League' },
  { slug: 'laliga', name: 'LaLiga' },
  { slug: 'serie-a', name: 'Serie A' },
  { slug: 'ligue-1', name: 'Ligue 1' },
  { slug: 'bundesliga', name: 'Bundesliga' },
];

export default function LeagueMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-50">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full text-white"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg w-56 p-2">
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
        </div>
      )}
    </div>
  );
}
