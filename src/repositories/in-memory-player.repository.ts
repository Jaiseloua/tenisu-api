import { players as defaultPlayers } from '../data/players.data';
import type { NewPlayer, Player } from '../types/player';
import type { PlayerRepository } from './player.repository';

// async pour garder la même signature qu'un appel à une vraie API.
// Les données ne sont pas persistées : un redémarrage remet le jeu de données initial.
export class InMemoryPlayerRepository implements PlayerRepository {
  private readonly players: Player[];

  constructor(initialPlayers: readonly Player[] = defaultPlayers) {
    this.players = [...initialPlayers];
  }

  async findAll(): Promise<Player[]> {
    return [...this.players];
  }

  async findById(id: number): Promise<Player | undefined> {
    return this.players.find((player) => player.id === id);
  }

  async create(newPlayer: NewPlayer): Promise<Player> {
    const nextId = Math.max(0, ...this.players.map((p) => p.id)) + 1;
    const player = { id: nextId, ...newPlayer };
    this.players.push(player);
    return player;
  }
}
