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
});
