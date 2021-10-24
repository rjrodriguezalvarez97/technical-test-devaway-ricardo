/* eslint-disable no-undef */
const RaceService = require('../src/Service/RaceService');

const raceService = new RaceService();

const races = [
  {
    _id: '617195d20e743fec97692e04',
    name: 'Race 0',
    laps: [
      {
        driver: '5fd7dbd8ce3a40582fb9ee6b',
        time: '00:11:03.697',
        _id: '617195d20e743fec97692e0d'
      },
      {
        driver: '5fd7dbd8ce3a40582fb9ee6b',
        time: '00:08:20.226',
        _id: '617195d20e743fec97692e0e'
      },
      {
        driver: '5fd7dbd84c10103c125fc1af',
        time: '00:08:39.615',
        _id: '617195d20e743fec97692e0f'
      },
      {
        driver: '5fd7dbd84c10103c125fc1af',
        time: '00:08:35.276',
        _id: '617195d20e743fec97692e10'
      }
    ],
    drivers: ['5fd7dbd8ce3a40582fb9ee6b', '5fd7dbd84c10103c125fc1af'],
    __v: 0
  },
  {
    _id: '617195d20e743fec97692e19',
    name: 'Race 1',
    laps: [
      {
        driver: '5fd7dbd8ce3a40582fb9ee6b',
        time: '00:08:12.974',
        _id: '617195d20e743fec97692e22'
      },
      {
        driver: '5fd7dbd8ce3a40582fb9ee6b',
        time: '00:13:18.668',
        _id: '617195d20e743fec97692e23'
      },
      {
        driver: '5fd7dbd84c10103c125fc1af',
        time: '00:13:52.998',
        _id: '617195d20e743fec97692e24'
      },
      {
        driver: '5fd7dbd84c10103c125fc1af',
        time: '00:08:00.993',
        _id: '617195d20e743fec97692e25'
      }
    ],
    drivers: ['5fd7dbd8ce3a40582fb9ee6b', '5fd7dbd84c10103c125fc1af'],
    __v: 0
  },
  {
    _id: '617195d20e743fec97692e19',
    name: 'Race 3',
    laps: [
      {
        driver: '5fd7dbd8ce3a40582fb9ee6b',
        time: '00:08:12.974',
        _id: '617195d20e743fec97692e22'
      },
      {
        driver: '5fd7dbd8ce3a40582fb9ee6b',
        time: '00:13:18.668',
        _id: '617195d20e743fec97692e23'
      }
    ],
    drivers: ['5fd7dbd8ce3a40582fb9ee6b'],
    __v: 0
  }
];
describe('RaceService tests', () => {
  it('Should get races of driver', () => {
    const driverId = '5fd7dbd84c10103c125fc1af';
    const result = raceService.getRacesOfDriver(races, driverId);

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Race 0');
    expect(result[1].name).toBe('Race 1');
  });

  it("Should extract driver's laps of a given race", () => {
    const driverId = '5fd7dbd84c10103c125fc1af';
    const race = {
      _id: '617195d20e743fec97692e04',
      name: 'Race 0',
      laps: [
        {
          driver: '5fd7dbd8ce3a40582fb9ee6b',
          time: '00:11:03.697',
          _id: '617195d20e743fec97692e0d'
        },
        {
          driver: '5fd7dbd8ce3a40582fb9ee6b',
          time: '00:08:20.226',
          _id: '617195d20e743fec97692e0e'
        },
        {
          driver: '5fd7dbd84c10103c125fc1af',
          time: '00:08:39.615',
          _id: '617195d20e743fec97692e0f'
        },
        {
          driver: '5fd7dbd84c10103c125fc1af',
          time: '00:08:35.276',
          _id: '617195d20e743fec97692e10'
        }
      ],
      drivers: ['5fd7dbd8ce3a40582fb9ee6b', '5fd7dbd84c10103c125fc1af'],
      __v: 0
    };
    const expected = [
      {
        time: '00:08:39.615'
      },
      {
        time: '00:08:35.276'
      }
    ];
    const result = raceService.extractDriversLapsOfRace(race, driverId);

    expect(result).toEqual(expected);
  });

  it('Should get the fastest lap', () => {
    const laps = [
      {
        time: '00:10:31.078'
      },
      {
        time: '00:11:50.041'
      },
      {
        time: '00:13:15.914'
      },
      {
        time: '00:08:04.951'
      }
    ];

    const result = raceService.getBestLap(laps);
    const expected = laps[3].time;

    expect(result).toEqual(expected);
  });

  it('Should calculate drivers total time and best lap', () => {
    const expected = [
      {
        driver: '5fd7dbd8ce3a40582fb9ee6b',
        totalTime: 1163.923,
        bestLap: '00:08:20.226',
        points: 0
      },
      {
        driver: '5fd7dbd84c10103c125fc1af',
        totalTime: 1034.891,
        bestLap: '00:08:35.276',
        points: 0
      }
    ];

    const result = raceService.calculateDriversTimeAndBestLap(races[0]);

    expect(result).toEqual(expected);
  });

  it('Should calculate the points and order of a race', () => {
    const drivers = [
      {
        driver: '789',
        totalTime: 1500.789,
        bestLap: '00:08:20.225',
        points: 0
      },
      {
        driver: '123',
        totalTime: 1163.923,
        bestLap: '00:08:20.226',
        points: 0
      },
      {
        driver: '456',
        totalTime: 1034.891,
        bestLap: '00:08:35.276',
        points: 0
      }
    ];
    const expected = [
      {
        driver: '456',
        totalTime: 1034.891,
        bestLap: '00:08:35.276',
        points: 25
      },
      {
        driver: '123',
        totalTime: 1163.923,
        bestLap: '00:08:20.226',
        points: 18
      },
      {
        driver: '789',
        totalTime: 1500.789,
        bestLap: '00:08:20.225',
        points: 16
      }
    ];

    const result = raceService.calculatePointsOfRace(drivers);

    expect(result).toEqual(expected);
  });

  it('Should get the ranking of a race', () => {
    const expected = {
      _id: '617195d20e743fec97692e04',
      name: 'Race 0',
      ranking: [
        {
          driver: '5fd7dbd84c10103c125fc1af',
          totalTime: '00:17:14.891',
          points: 25,
          bestLap: '00:08:35.276'
        },
        {
          driver: '5fd7dbd8ce3a40582fb9ee6b',
          totalTime: '00:19:23.923',
          points: 19,
          bestLap: '00:08:20.226'
        }
      ]
    };
    const result = raceService.getRaceRanking(races[0]);

    expect(result).toEqual(expected);
  });
});
