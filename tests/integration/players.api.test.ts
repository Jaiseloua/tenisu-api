import request from 'supertest';
import { createApp } from '../../src/app';
import type { PlayerRepository } from '../../src/repositories/player.repository';
import { PlayerService } from '../../src/services/player.service';

const app = createApp();

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/players', () => {
  it('returns all players sorted by rank', async () => {
    const res = await request(app).get('/api/players');

    expect(res.status).toBe(200);
    expect(res.body.map((p: { id: number }) => p.id)).toEqual([17, 52, 102, 65, 95]);
  });
});

describe('GET /api/players/:id', () => {
  it('returns the player', async () => {
    const res = await request(app).get('/api/players/52');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 52, firstname: 'Novak', lastname: 'Djokovic' });
  });

  it('returns 404 for an unknown player', async () => {
    const res = await request(app).get('/api/players/999');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it.each(['abc', '0', '-1', '1.5', '1e3', '99999999999999999999'])(
    'returns 400 for invalid id "%s"',
    async (id) => {
      const res = await request(app).get(`/api/players/${id}`);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('BAD_REQUEST');
    },
  );
});

describe('GET /api/players/stats', () => {
  it('returns the statistics', async () => {
    const res = await request(app).get('/api/players/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      countryWithHighestWinRatio: { countryCode: 'SRB', winRatio: 1 },
      averageBmi: 23.36,
      medianHeightCm: 185,
    });
  });
});

describe('error handling', () => {
  it('returns 404 for an unknown route', async () => {
    const res = await request(app).get('/unknown');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
  });

  it('returns a generic 500 without leaking details on unexpected errors', async () => {
    const failingRepository: PlayerRepository = {
      findAll: () => Promise.reject(new Error('database is down')),
      findById: () => Promise.reject(new Error('database is down')),
      create: () => Promise.reject(new Error('database is down')),
    };
    const failingApp = createApp(new PlayerService(failingRepository));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const res = await request(failingApp).get('/api/players');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' },
    });
    expect(JSON.stringify(res.body)).not.toContain('database');
  });
});
