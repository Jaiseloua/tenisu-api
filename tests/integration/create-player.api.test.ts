import request from 'supertest';
import { createApp } from '../../src/app';

const validPlayer = {
  firstname: 'Carlos',
  lastname: 'Alcaraz',
  shortname: 'C.ALC',
  sex: 'M',
  country: { pictureUrl: 'https://example.com/spain.png', code: 'ESP' },
  pictureUrl: 'https://example.com/alcaraz.png',
  data: { rank: 3, points: 2200, weight: 74000, height: 183, age: 21, last: [1, 1, 0, 1, 1] },
};

describe('POST /api/players', () => {
  it('creates the player and returns 201 with its location', async () => {
    const app = createApp();

    const res = await request(app).post('/api/players').send(validPlayer);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 103, ...validPlayer });
    expect(res.headers.location).toBe('/api/players/103');

    const created = await request(app).get('/api/players/103');
    expect(created.status).toBe(200);
    expect(created.body.lastname).toBe('Alcaraz');
  });

  it('includes the new player in the sorted list', async () => {
    const app = createApp();
    await request(app).post('/api/players').send(validPlayer);

    const res = await request(app).get('/api/players');

    expect(res.body.data.map((p: { id: number }) => p.id)).toEqual([17, 52, 103, 102, 65, 95]);
    expect(res.body.count).toBe(6);
  });

  it('ignores an id sent by the client', async () => {
    const res = await request(createApp())
      .post('/api/players')
      .send({ ...validPlayer, id: 1 });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(103);
  });

  it.each([
    ['a missing field', { ...validPlayer, firstname: undefined }, 'firstname'],
    ['an invalid sex', { ...validPlayer, sex: 'X' }, 'sex'],
    [
      'a negative weight',
      { ...validPlayer, data: { ...validPlayer.data, weight: -1 } },
      'data.weight',
    ],
    [
      'a match result other than 0/1',
      { ...validPlayer, data: { ...validPlayer.data, last: [2] } },
      'data.last.0',
    ],
    [
      'an invalid country code',
      { ...validPlayer, country: { ...validPlayer.country, code: 'es' } },
      'country.code',
    ],
  ])('returns 400 for %s', async (_case, body, field) => {
    const res = await request(createApp()).post('/api/players').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
    expect(res.body.error.message).toContain(field);
  });

  it('returns 400 when the body is not an object', async () => {
    const res = await request(createApp()).post('/api/players').send([]);

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('body');
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(createApp())
      .post('/api/players')
      .set('Content-Type', 'application/json')
      .send('{ not json');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REQUEST_BODY');
  });
});
