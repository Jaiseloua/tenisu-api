import { computeBmi, findCountryWithHighestWinRatio } from '../../src/utils/player-metrics';
import { buildPlayer } from '../helpers/player.factory';

describe('computeBmi', () => {
  it('converts grams and centimeters before computing kg/m²', () => {
    // 80 kg / (2 m)² = 20
    expect(computeBmi(80000, 200)).toBe(20);
  });

  it.each([
    [0, 180],
    [80000, 0],
    [-1, 180],
  ])('throws for non-positive values (weight=%d, height=%d)', (weight, height) => {
    expect(() => computeBmi(weight, height)).toThrow(RangeError);
  });
});

describe('findCountryWithHighestWinRatio', () => {
  it('returns null when there are no players', () => {
    expect(findCountryWithHighestWinRatio([])).toBeNull();
  });

  it('returns null when no matches have been played', () => {
    expect(findCountryWithHighestWinRatio([buildPlayer({ data: { last: [] } })])).toBeNull();
  });

  it('aggregates matches per country instead of averaging individual ratios', () => {
    const players = [
      // FRA : 1 victoire sur 1 + 0 sur 4 => 1/5 = 0.2 (moyenne des ratios = 0.5)
      buildPlayer({ id: 1, countryCode: 'FRA', data: { last: [1] } }),
      buildPlayer({ id: 2, countryCode: 'FRA', data: { last: [0, 0, 0, 0] } }),
      // ESP : 2 victoires sur 5 => 0.4
      buildPlayer({ id: 3, countryCode: 'ESP', data: { last: [1, 1, 0, 0, 0] } }),
    ];

    expect(findCountryWithHighestWinRatio(players)).toEqual({ countryCode: 'ESP', winRatio: 0.4 });
  });

  it('keeps the first country encountered in case of a tie', () => {
    const players = [
      buildPlayer({ id: 1, countryCode: 'FRA', data: { last: [1, 0] } }),
      buildPlayer({ id: 2, countryCode: 'ESP', data: { last: [0, 1] } }),
    ];

    expect(findCountryWithHighestWinRatio(players)?.countryCode).toBe('FRA');
  });
});
