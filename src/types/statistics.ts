export interface CountryWinRatio {
  countryCode: string;
  winRatio: number;
}

export interface PlayerStatistics {
  countryWithHighestWinRatio: CountryWinRatio | null;
  averageBmi: number | null;
  medianHeightCm: number | null;
}
