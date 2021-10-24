/* eslint-disable no-undef */
const { TimeToSeconds, SecondsToTime } = require('../src/Service/UtilsService');

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
});
