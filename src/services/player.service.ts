import { NotFoundError } from '../errors/app-error';
import type { PlayerRepository } from '../repositories/player.repository';
import type { PaginatedResult, Pagination } from '../types/pagination';
import type { NewPlayer, Player } from '../types/player';
import type { PlayerStatistics } from '../types/statistics';
import { average, median, roundTo } from '../utils/math';
import { computeBmi, findCountryWithHighestWinRatio } from '../utils/player-metrics';

export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  // rang 1 = meilleur joueur
  async getPlayersSortedByRank({ page, limit }: Pagination): Promise<PaginatedResult<Player>> {
    const players = await this.playerRepository.findAll();
    players.sort((a, b) => a.data.rank - b.data.rank);

    const start = (page - 1) * limit;
    return {
      data: players.slice(start, start + limit),
      count: players.length,
      page,
      limit,
    };
  }

  async getPlayerById(id: number): Promise<Player> {
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new NotFoundError(`Player with id ${id} not found`);
    }
    return player;
  }

  async createPlayer(newPlayer: NewPlayer): Promise<Player> {
    return this.playerRepository.create(newPlayer);
  }

  async getStatistics(): Promise<PlayerStatistics> {
    const players = await this.playerRepository.findAll();

    const bestCountry = findCountryWithHighestWinRatio(players);
    const bmis = players.map((p) => computeBmi(p.data.weight, p.data.height));
    const heights = players.map((p) => p.data.height);
    const averageBmi = average(bmis);

    return {
      countryWithHighestWinRatio: bestCountry
        ? { countryCode: bestCountry.countryCode, winRatio: roundTo(bestCountry.winRatio, 2) }
        : null,
      averageBmi: averageBmi !== null ? roundTo(averageBmi, 2) : null,
      medianHeightCm: median(heights),
    };
  }
}
