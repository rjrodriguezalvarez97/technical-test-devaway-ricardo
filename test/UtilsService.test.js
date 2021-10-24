/* eslint-disable no-undef */
const {
  TimeToSeconds,
  SecondsToTime,
  SortRanking
} = require('../src/Service/UtilsService');

describe('UtilsService', () => {
  it('Should transform a time string into seconds', () => {
    const time = '01:10:31.190';
    const expected = 4231.19;
    const result = TimeToSeconds(time);

    expect(result).toBe(expected);
  });

  it('Should transform secons into a time string', () => {
    const seconds = 4231.19;
    const expected = '01:10:31.190';
    const result = SecondsToTime(seconds);

    expect(result).toBe(expected);
  });

  it('Should round properly the ms', () => {
    const seconds = 515.276;
    const expected = '00:08:35.276';
    const result = SecondsToTime(seconds);
    expect(result).toBe(expected);
  });

  it('Should sort an array based on the points', () => {
    const arr = [
      { points: 10 },
      { points: 30 },
      { points: 15 },
      { points: 20 },
      { points: 1 },
      { points: 2 }
    ];
    const expected = [
      { points: 30 },
      { points: 20 },
      { points: 15 },
      { points: 10 },
      { points: 2 },
      { points: 1 }
    ];
    const result = SortRanking(arr);

    expect(expected).toEqual(result);
  });
});
