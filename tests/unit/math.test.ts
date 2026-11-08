import { average, median, roundTo } from '../../src/utils/math';

describe('average', () => {
  it('returns null for an empty list', () => {
    expect(average([])).toBeNull();
  });

  it('computes the arithmetic mean', () => {
    expect(average([1, 2, 3, 4])).toBe(2.5);
  });
});

describe('median', () => {
  it('returns null for an empty list', () => {
    expect(median([])).toBeNull();
  });

  it('returns the middle value for an odd-sized list', () => {
    expect(median([188, 175, 185])).toBe(185);
  });

  it('returns the mean of the two middle values for an even-sized list', () => {
    expect(median([190, 170, 180, 175])).toBe(177.5);
  });

  it('does not mutate the input', () => {
    const values = [3, 1, 2];
    median(values);
    expect(values).toEqual([3, 1, 2]);
  });
});

describe('roundTo', () => {
  it('rounds to the given number of decimals', () => {
    expect(roundTo(23.35784, 2)).toBe(23.36);
    expect(roundTo(0.666, 1)).toBe(0.7);
  });
});
