import type { Player } from '../types/player';
import type { CountryWinRatio } from '../types/statistics';
import { sum } from './math';

const GRAMS_PER_KG = 1000;
const CM_PER_METER = 100;

export function computeBmi(weightInGrams: number, heightInCm: number): number {
  if (weightInGrams <= 0 || heightInCm <= 0) {
    throw new RangeError('Weight and height must be strictly positive');
  }
  const weightKg = weightInGrams / GRAMS_PER_KG;
  const heightM = heightInCm / CM_PER_METER;
  return weightKg / (heightM * heightM);
}

export function findCountryWithHighestWinRatio(players: readonly Player[]): CountryWinRatio | null {
  const countries = new Map<string, { wins: number; matches: number }>();
  for (const { country, data } of players) {
    const total = countries.get(country.code) ?? { wins: 0, matches: 0 };
    total.wins += sum(data.last);
    total.matches += data.last.length;
    countries.set(country.code, total);
  }

  const ratios = [...countries]
    .filter(([, total]) => total.matches > 0)
    .map(([countryCode, total]) => ({ countryCode, winRatio: total.wins / total.matches }));

  ratios.sort((a, b) => b.winRatio - a.winRatio);
  return ratios[0] ?? null;
}
