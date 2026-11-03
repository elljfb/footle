import { players } from '../data/players';

export interface GeneratorItem {
  details: { label: string; value: string }[];
  dateOfBirth?: string;
}

const playersByName = new Map<string, GeneratorItem>();
const teamsByName = new Map<string, GeneratorItem>();

for (const player of players) {
  const playerName = player.name.trim();
  if (playerName && !playersByName.has(playerName)) {
    playersByName.set(playerName, {
      details: [
        { label: 'Team', value: player.club },
        { label: 'Position', value: player.subPosition },
      ],
      dateOfBirth: player.dateOfBirth,
    });
  }

  const teamName = player.club.trim();
  if (teamName && !teamsByName.has(teamName)) {
    teamsByName.set(teamName, {
      details: [{ label: 'League', value: player.league }],
    });
  }
}

export const FOOTBALL_PLAYERS = [...playersByName.keys()]
  .sort((a, b) => a.localeCompare(b));

export const FOOTBALL_PLAYER_DETAILS = Object.fromEntries(playersByName);
export const FOOTBALL_TEAM_DETAILS = Object.fromEntries(teamsByName);

export const FOOTBALL_TEAMS = [...teamsByName.keys()]
  .sort((a, b) => a.localeCompare(b));
