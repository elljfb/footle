export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export type SubPosition = 
  | 'Goalkeeper'
  | 'Right-Back'
  | 'Center-Back'
  | 'Left-Back'
  | 'Defensive Midfielder'
  | 'Central Midfielder'
  | 'Attacking Midfielder'
  | 'Right Winger'
  | 'Left Winger'
  | 'Striker';

export type Foot = 'Left' | 'Right' | 'Both';

export interface Player {
  id: string;
  name: string;
  position: Position;
  subPosition: SubPosition;
  age: number;
  dateOfBirth: string;
  nationality: string;
  club: string;
  league: string;
  height: number;
  foot: Foot;
  image: string;
}

export type GuessResult = 'correct' | 'close' | 'incorrect';

export interface GuessResponse {
  position: GuessResult;
  subPosition: GuessResult;
  age: GuessResult;
  nationality: GuessResult;
  club: GuessResult;
  league: GuessResult;
  height: GuessResult;
  foot: GuessResult;
  isCorrect: boolean;
} 