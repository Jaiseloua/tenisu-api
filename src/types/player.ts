export type Sex = 'M' | 'F';

export interface Country {
  pictureUrl: string;
  code: string;
}

export interface PlayerData {
  rank: number;
  points: number;
  weight: number; // en grammes
  height: number; // en cm
  age: number;
  last: number[]; // 1 = victoire, 0 = défaite
}

export interface Player {
  id: number;
  firstname: string;
  lastname: string;
  shortname: string;
  sex: Sex;
  country: Country;
  pictureUrl: string;
  data: PlayerData;
}

// l'id est généré par le serveur
export type NewPlayer = Omit<Player, 'id'>;
