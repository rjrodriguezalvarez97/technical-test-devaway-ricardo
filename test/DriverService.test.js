/* eslint-disable no-undef */

const database = require('../src/DatabaseConnection');
const DriverService = require('../src/Service/DriverService');

const driverService = new DriverService();

const drivers = [
  {
    _id: '5fd7dbd8ce3a40582fb9ee6b',
    picture: 'http://placehold.it/64x64',
    age: 23,
    name: 'Cooke Rivers',
    team: 'PROTODYNE',
    __v: 0
  },
  {
    _id: '5fd7dbd84c10103c125fc1af',
    picture: 'http://placehold.it/64x64',
    age: 30,
    name: 'May Valentine',
    team: 'CUBICIDE',
    __v: 0
  }
];

describe('DriverService database tests', () => {
  beforeAll(async () => {
    await database.connect({ server: 'localhost', database: 'karts-testing' });
  });
  beforeEach(async () => {
    await database.dropDatabase();
  });
  afterEach(async () => {
    await database.dropDatabase();
  });
  afterAll(() => {
    database.disconnect();
  });

  it('Should save a driver', async () => {
    const driver = drivers[0];
    const result = await driverService.createDocAndSave(driver);

    expect(result.name).toEqual(driver.name);
    expect(result.picture).toEqual(driver.picture);
    expect(result._id.toString()).toEqual(driver._id);
    expect(result.team).toEqual(driver.team);
    expect(result.age).toEqual(driver.age);
  });
  it('Should throw an exception when validating the document', async () => {
    const driver = drivers[0];
    delete driver.name;
    expect(() => driverService.createDocAndSave(driver)).toThrow(
      'name is required'
    );
  });
});
