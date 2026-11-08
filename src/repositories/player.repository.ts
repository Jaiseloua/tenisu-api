import type { NewPlayer, Player } from '../types/player';

export interface PlayerRepository {
  findAll(): Promise<Player[]>;
  findById(id: number): Promise<Player | undefined>;
  create(player: NewPlayer): Promise<Player>;
}
