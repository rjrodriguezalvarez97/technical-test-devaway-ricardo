/* eslint-disable no-undef */
const jsonData = require('./import.json');
const ImportService = require('../src/Service/ImportService');
const RaceService = require('../src/Service/RaceService');
const DriverService = require('../src/Service/DriverService');

const database = require('../src/DatabaseConnection');

const importService = new ImportService();
const parsedRaces = [
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
        time: '00:08:17.974',
        _id: '617195d20e743fec97692e22'
      },
      {
        driver: '5fd7dbd8ce3a40582fb9ee6b',
        time: '00:24:18.668',
        _id: '617195d20e743fec97692e23'
      }
    ],
    drivers: ['5fd7dbd8ce3a40582fb9ee6b'],
    __v: 0
  }
];
describe('ImportService tests', () => {
  beforeEach(() => jest.clearAllMocks());

  it('Should parse laps', () => {
    const driverId = '1234';
    const laps = [
      {
        time: '00:10:31.078'
      },
      {
        time: '00:11:50.041'
      }
    ];
    const expected = [
      {
        time: '00:10:31.078',
        driver: '1234'
      },
      {
        time: '00:11:50.041',
        driver: '1234'
      }
    ];
    const result = importService.parseLaps(laps, driverId);
    expect(result).toEqual(expected);
  });
  it('Should parse races of a given driver', () => {
    const races = [
      {
        name: 'Race 0',
        laps: [
          {
            time: '00:11:03.697'
          },
          {
            time: '00:08:20.226'
          }
        ]
      },
      {
        name: 'Race 1',
        laps: [
          {
            time: '00:08:12.974'
          },
          {
            time: '00:13:18.668'
          }
        ]
      }
    ];
    const driverId = '1234';

    const expected = new Map([
      [
        'Race 1',
        {
          name: 'Race 1',
          drivers: ['1234'],
          laps: [
            {
              time: '00:08:12.974',

              driver: '1234'
            },
            {
              time: '00:13:18.668',
              driver: '1234'
            }
          ]
        }
      ],
      [
        'Race 0',
        {
          name: 'Race 0',
          drivers: ['1234'],
          laps: [
            {
              time: '00:11:03.697',
              driver: '1234'
            },
            {
              time: '00:08:20.226',
              driver: '1234'
            }
          ]
        }
      ]
    ]);

    const result = importService.parseRaces(races, driverId);

    expect(result).toEqual(expected);
  });
  it('Should update the races accumulator', () => {
    const oldAccumulator = new Map([
      [
        'Race 1',
        {
          name: 'Race 1',
          drivers: ['1234'],
          laps: [
            {
              time: '00:08:12.974',

              driver: '1234'
            },
            {
              time: '00:13:18.668',
              driver: '1234'
            }
          ]
        }
      ],
      [
        'Race 0',
        {
          name: 'Race 0',
          drivers: ['1234'],
          laps: [
            {
              time: '00:11:03.697',
              driver: '1234'
            },
            {
              time: '00:08:20.226',
              driver: '1234'
            }
          ]
        }
      ]
    ]);
    const newAccumulator = new Map([
      [
        'Race 3',
        {
          name: 'Race 3',
          drivers: ['9876'],
          laps: [
            {
              time: '00:01:12.974',

              driver: '9876'
            },
            {
              time: '00:44:18.668',
              driver: '9876'
            }
          ]
        }
      ],
      [
        'Race 0',
        {
          name: 'Race 0',
          drivers: ['9876'],
          laps: [
            {
              time: '00:11:03.697',
              driver: '9876'
            },
            {
              time: '00:08:20.226',
              driver: '9876'
            }
          ]
        }
      ]
    ]);

    const expected = new Map([
      [
        'Race 1',
        {
          name: 'Race 1',
          drivers: ['1234'],
          laps: [
            {
              time: '00:08:12.974',

              driver: '1234'
            },
            {
              time: '00:13:18.668',
              driver: '1234'
            }
          ]
        }
      ],
      [
        'Race 0',
        {
          name: 'Race 0',
          drivers: ['1234', '9876'],
          laps: [
            {
              time: '00:11:03.697',
              driver: '1234'
            },
            {
              time: '00:08:20.226',
              driver: '1234'
            },
            {
              time: '00:11:03.697',
              driver: '9876'
            },
            {
              time: '00:08:20.226',
              driver: '9876'
            }
          ]
        }
      ],
      [
        'Race 3',
        {
          name: 'Race 3',
          drivers: ['9876'],
          laps: [
            {
              time: '00:01:12.974',

              driver: '9876'
            },
            {
              time: '00:44:18.668',
              driver: '9876'
            }
          ]
        }
      ]
    ]);

    const result = importService.updateRacesAccumulator(
      oldAccumulator,
      newAccumulator
    );

    expect(result).toEqual(expected);
  });

  it("Should format driver's races for export", () => {
    const driverId = '5fd7dbd84c10103c125fc1af';
    const expected = [
      {
        name: 'Race 0',
        laps: [
          {
            time: '00:08:39.615'
          },
          {
            time: '00:08:35.276'
          }
        ]
      },
      {
        name: 'Race 1',
        laps: [
          {
            time: '00:13:52.998'
          },
          {
            time: '00:08:00.993'
          }
        ]
      }
    ];
    const [race1, race2] = parsedRaces;
    const result = importService.formatDriverRacesForExport(
      [race1, race2],
      driverId
    );

    expect(result).toEqual(expected);
  });

  it('Should export a driver', () => {
    const driver = {
      _id: '5fd7dbd84c10103c125fc1af',
      picture: 'http://placehold.it/64x64',
      age: 30,
      name: 'May Valentine',
      team: 'CUBICIDE'
    };
    const expected = {
      _id: '5fd7dbd84c10103c125fc1af',
      picture: 'http://placehold.it/64x64',
      age: 30,
      name: 'May Valentine',
      team: 'CUBICIDE',
      races: [
        {
          name: 'Race 0',
          laps: [
            {
              time: '00:08:39.615'
            },
            {
              time: '00:08:35.276'
            }
          ]
        },
        {
          name: 'Race 1',
          laps: [
            {
              time: '00:13:52.998'
            },
            {
              time: '00:08:00.993'
            }
          ]
        }
      ]
    };

    const result = importService.exportDriver(parsedRaces, driver);

    expect(result).toEqual(expected);
  });

  it('Should export the championship', async () => {
    const drivers = [
      {
        _id: '5fd7dbd8ce3a40582fb9ee6b',
        picture: 'http://placehold.it/64x64',
        age: 23,
        name: 'Cooke Rivers',
        team: 'PROTODYNE'
      },
      {
        _id: '5fd7dbd84c10103c125fc1af',
        picture: 'http://placehold.it/64x64',
        age: 30,
        name: 'May Valentine',
        team: 'CUBICIDE'
      }
    ];
    const expected = [
      {
        _id: '5fd7dbd8ce3a40582fb9ee6b',
        picture: 'http://placehold.it/64x64',
        age: 23,
        name: 'Cooke Rivers',
        team: 'PROTODYNE',
        races: [
          {
            name: 'Race 0',
            laps: [
              {
                time: '00:11:03.697'
              },
              {
                time: '00:08:20.226'
              }
            ]
          },
          {
            name: 'Race 1',
            laps: [
              {
                time: '00:08:12.974'
              },
              {
                time: '00:13:18.668'
              }
            ]
          },
          {
            name: 'Race 3',
            laps: [
              {
                time: '00:08:17.974'
              },
              {
                time: '00:24:18.668'
              }
            ]
          }
        ]
      },
      {
        _id: '5fd7dbd84c10103c125fc1af',
        picture: 'http://placehold.it/64x64',
        age: 30,
        name: 'May Valentine',
        team: 'CUBICIDE',
        races: [
          {
            name: 'Race 0',
            laps: [
              {
                time: '00:08:39.615'
              },
              {
                time: '00:08:35.276'
              }
            ]
          },
          {
            name: 'Race 1',
            laps: [
              {
                time: '00:13:52.998'
              },
              {
                time: '00:08:00.993'
              }
            ]
          }
        ]
      }
    ];
    const raceService = new RaceService();
    const driverService = new DriverService();
    const service = new ImportService({ raceService, driverService });
    jest
      .spyOn(raceService, 'getAllRaces')
      .mockImplementationOnce(() => parsedRaces);
    jest
      .spyOn(driverService, 'getAllDrivers')
      .mockImplementationOnce(() => drivers);

    const result = await service.export();

    expect(result).toEqual(expected);
  });
});

describe('ImportService database tests', () => {
  beforeAll(async () => {
    await database.connect({ server: 'localhost', database: 'karts-testing' });
  });
  afterEach(async () => {
    await database.dropDatabase();
  });
  afterAll(() => {
    database.disconnect();
  });

  it('Should create driver and races docs', async () => {
    const drivers = [
      {
        _id: '5fd7dbd8ce3a40582fb9ee6b',
        picture: 'http://placehold.it/64x64',
        age: 23,
        name: 'Cooke Rivers',
        team: 'PROTODYNE'
      },
      {
        _id: '5fd7dbd84c10103c125fc1af',
        picture: 'http://placehold.it/64x64',
        age: 30,
        name: 'May Valentine',
        team: 'CUBICIDE'
      }
    ];
    const races = new Map([
      [
        'Race 1',
        {
          name: 'Race 1',
          drivers: ['5fd7dbd8ce3a40582fb9ee6b'],
          laps: [
            {
              time: '00:08:12.974',

              driver: '5fd7dbd8ce3a40582fb9ee6b'
            },
            {
              time: '00:13:18.668',
              driver: '5fd7dbd8ce3a40582fb9ee6b'
            }
          ]
        }
      ],
      [
        'Race 0',
        {
          name: 'Race 0',
          drivers: ['5fd7dbd8ce3a40582fb9ee6b', '5fd7dbd84c10103c125fc1af'],
          laps: [
            {
              time: '00:11:03.697',
              driver: '5fd7dbd8ce3a40582fb9ee6b'
            },
            {
              time: '00:08:20.226',
              driver: '5fd7dbd8ce3a40582fb9ee6b'
            },
            {
              time: '00:11:03.697',
              driver: '5fd7dbd84c10103c125fc1af'
            },
            {
              time: '00:08:20.226',
              driver: '5fd7dbd84c10103c125fc1af'
            }
          ]
        }
      ],
      [
        'Race 3',
        {
          name: 'Race 3',
          drivers: ['5fd7dbd84c10103c125fc1af'],
          laps: [
            {
              time: '00:01:12.974',

              driver: '5fd7dbd84c10103c125fc1af'
            },
            {
              time: '00:44:18.668',
              driver: '5fd7dbd84c10103c125fc1af'
            }
          ]
        }
      ]
    ]);

    const docs = importService.createDocs(drivers, races);

    expect(docs.length).toBe(races.size + drivers.length);

    const saved = await importService.writeDocs(docs);
    expect(saved.length).toBe(docs.length);
  });
  it('Full import test', async () => {
    const result = await importService.import(jsonData);

    expect(result.length).toBe(4);
    const [driver1, driver2, race0, race1] = result;
    expect(driver1.name).toBe(jsonData[0].name);
    expect(driver2.name).toBe(jsonData[1].name);
    expect(race0.laps.length).toBe(20);
    expect(race1.laps.length).toBe(20);
    expect(race0.drivers.includes(driver1._id));
    expect(race1.drivers.includes(driver1._id));
  });
});
