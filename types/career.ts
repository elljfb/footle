export interface CareerSpell {
  years: string;
  club: string;
  apps: number | null;
  goals: number | null;
}

export interface PlayerCareer {
  name: string;
  wikipediaUrl: string;
  seniorCareer: CareerSpell[];
  scrapedAt: string;
  error?: string;
}

export type CareerDifficulty = 'easy' | 'medium' | 'hard';
