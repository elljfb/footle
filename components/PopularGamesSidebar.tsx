import Link from 'next/link';

const popularGames = [
  { href: '/', title: 'Footle', description: 'Guess the mystery player', icon: '⚽' },
  { href: '/league/premier-league', title: 'Premier League Guess', description: 'A Premier League daily', icon: '🏆' },
  { href: '/grid', title: 'Football Grid', description: 'Complete the 3 × 3 grid', icon: '▦' },
  { href: '/eight-zero', title: '8-0', description: 'Draft a World Cup XI', icon: '🌍' },
  { href: '/player-of-the-season', title: 'Player of the Season', description: 'Build a player and simulate a season', icon: '🏃‍♂️' },
  { href: '/career', title: 'Career Mode', description: 'Follow a player’s career', icon: '👟' },
];

export default function PopularGamesSidebar() {
  return (
    <aside aria-label="Popular football games" className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#03E690]">Pick your next game</p>
        <h2 className="mt-1 text-xl font-bold text-white">Popular games</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {popularGames.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            prefetch={false}
            className="group flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/70 p-4 transition-colors hover:border-[#03E690]/60 hover:bg-gray-800"
          >
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-xl group-hover:bg-[#03E690]/10">
              {game.icon}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-white group-hover:text-[#03E690]">{game.title}</span>
              <span className="mt-1 block text-sm text-gray-400">{game.description}</span>
            </span>
          </Link>
        ))}
      </div>
      <Link href="/games" className="inline-flex text-sm font-semibold text-[#03E690] hover:text-emerald-300">
        Browse all games <span aria-hidden="true" className="ml-1">→</span>
      </Link>
    </aside>
  );
}
