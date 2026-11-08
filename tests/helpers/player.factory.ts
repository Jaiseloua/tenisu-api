import type { NewPlayer, Player, PlayerData } from '../../src/types/player';

/** Construit un joueur minimal pour les tests, en ne précisant que ce qui compte. */
export function buildPlayer(
  overrides: { id?: number; countryCode?: string; data?: Partial<PlayerData> } = {},
): Player {
  const id = overrides.id ?? 1;
  return {
    id,
    firstname: 'Test',
    lastname: `Player${id}`,
    shortname: `T.P${id}`,
    sex: 'M',
    country: { pictureUrl: 'https://example.com/flag.png', code: overrides.countryCode ?? 'FRA' },
    pictureUrl: 'https://example.com/player.png',
    data: {
      rank: 1,
      points: 1000,
      weight: 80000,
      height: 180,
      age: 25,
      last: [1, 0, 1, 0, 1],
      ...overrides.data,
    },
  };
}

export function buildNewPlayer(): NewPlayer {
  const { id, ...newPlayer } = buildPlayer();
  void id;
  return newPlayer;
}
