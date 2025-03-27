export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export type SubPosition = 
  | 'Goalkeeper'
  | 'Right-Back'
  | 'Centre-Back'
  | 'Left-Back'
  | 'Defensive Midfielder'
  | 'Central Midfielder'
  | 'Attacking Midfielder'
  | 'Right Winger'
  | 'Left Winger'
  | 'Striker';

export type Foot = 'Left' | 'Right' | 'Both';

export interface Player {
  id: number;
  name: string;
  position: Position;
  subPosition: SubPosition;
  dateOfBirth: string; // Format: "YYYY-MM-DD"
  nationality: string;
  club: string;
  league: string;
  height: number;
  foot: Foot;
  image?: string;
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

export interface GuessResponseWithValues extends GuessResponse {
  values: {
    position: Position;
    subPosition: SubPosition;
    age: number;
    nationality: string;
    club: string;
    league: string;
    height: number;
    foot: Foot;
  };
} 