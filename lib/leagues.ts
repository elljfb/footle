export interface LeagueOption {
  slug: string;
  name: string;
}

export const LEAGUE_OPTIONS: LeagueOption[] = [
  { slug: 'premier-league', name: 'Premier League' },
  { slug: 'laliga', name: 'LaLiga' },
  { slug: 'serie-a', name: 'Serie A' },
  { slug: 'ligue-1', name: 'Ligue 1' },
  { slug: 'bundesliga', name: 'Bundesliga' },
];

export const slugToLeagueName: Record<string, string> = LEAGUE_OPTIONS.reduce(
  (acc, league) => {
    acc[league.slug] = league.name;
    return acc;
  },
  {} as Record<string, string>
);
