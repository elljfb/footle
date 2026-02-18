import { Player } from './player';

export interface CustomGame {
  id: number;
  slug: string;
  title: string | null;
  targetPlayerId: number;
  selectedLeagues: string[] | null;
  createdAt: string;
}

export interface CustomGameWithPlayer extends CustomGame {
  targetPlayer: Player;
}

