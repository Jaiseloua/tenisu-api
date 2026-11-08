import { NotFoundError } from '../../src/errors/app-error';
import { InMemoryPlayerRepository } from '../../src/repositories/in-memory-player.repository';
import { PlayerService } from '../../src/services/player.service';
import { buildNewPlayer, buildPlayer } from '../helpers/player.factory';

describe('PlayerService', () => {
  describe('getPlayersSortedByRank', () => {
    it('sorts players from best (rank 1) to worst', async () => {
      const service = new PlayerService(
        new InMemoryPlayerRepository([
          buildPlayer({ id: 1, data: { rank: 30 } }),
          buildPlayer({ id: 2, data: { rank: 1 } }),
          buildPlayer({ id: 3, data: { rank: 7 } }),
        ]),
      );

      const players = await service.getPlayersSortedByRank();

      expect(players.map((p) => p.id)).toEqual([2, 3, 1]);
    });
  });

  describe('getPlayerById', () => {
    const service = new PlayerService(new InMemoryPlayerRepository([buildPlayer({ id: 42 })]));

    it('returns the matching player', async () => {
      await expect(service.getPlayerById(42)).resolves.toMatchObject({ id: 42 });
    });

    it('throws a NotFoundError for an unknown id', async () => {
      await expect(service.getPlayerById(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('getStatistics', () => {
    it('returns null values when there are no players', async () => {
      const service = new PlayerService(new InMemoryPlayerRepository([]));

      await expect(service.getStatistics()).resolves.toEqual({
        countryWithHighestWinRatio: null,
        averageBmi: null,
        medianHeightCm: null,
      });
    });

    it('computes the statistics on the provided dataset', async () => {
      const service = new PlayerService(new InMemoryPlayerRepository());

      await expect(service.getStatistics()).resolves.toEqual({
        countryWithHighestWinRatio: { countryCode: 'SRB', winRatio: 1 },
        averageBmi: 23.36,
        medianHeightCm: 185,
      });
    });
  });
});

describe('PlayerService.createPlayer', () => {
  it('assigns the next available id', async () => {
    const service = new PlayerService(
      new InMemoryPlayerRepository([buildPlayer({ id: 5 }), buildPlayer({ id: 12 })]),
    );

    const created = await service.createPlayer(buildNewPlayer());

    expect(created.id).toBe(13);
    await expect(service.getPlayerById(13)).resolves.toEqual(created);
  });

  it('starts at 1 when there are no players', async () => {
    const service = new PlayerService(new InMemoryPlayerRepository([]));

    await expect(service.createPlayer(buildNewPlayer())).resolves.toMatchObject({ id: 1 });
  });
});
