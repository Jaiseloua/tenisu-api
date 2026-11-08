import type { Player } from '../types/player';
import type { CountryWinRatio } from '../types/statistics';

const GRAMS_PER_KG = 1000;
const CM_PER_METER = 100;

// IMC = kg / m², les données sont en grammes et en cm
export function computeBmi(weightInGrams: number, heightInCm: number): number {
  if (weightInGrams <= 0 || heightInCm <= 0) {
    throw new RangeError('Weight and height must be strictly positive');
  }
  const weightKg = weightInGrams / GRAMS_PER_KG;
  const heightM = heightInCm / CM_PER_METER;
  return weightKg / (heightM * heightM);
}

// On additionne les matchs de tous les joueurs d'un pays plutôt que de faire
// la moyenne des ratios, sinon un joueur avec 1 seul match pèserait autant
// qu'un joueur qui en a 20.
export function findCountryWithHighestWinRatio(players: readonly Player[]): CountryWinRatio | null {
  const totals = new Map<string, { wins: number; matches: number }>();

  for (const { country, data } of players) {
    const current = totals.get(country.code) ?? { wins: 0, matches: 0 };
    current.wins += data.last.filter((result) => result === 1).length;
    current.matches += data.last.length;
    totals.set(country.code, current);
  }

  let best: CountryWinRatio | null = null;
  for (const [countryCode, { wins, matches }] of totals) {
    if (matches === 0) continue;
    const winRatio = wins / matches;
    if (best === null || winRatio > best.winRatio) {
      best = { countryCode, winRatio };
    }
  }
  return best;
}
