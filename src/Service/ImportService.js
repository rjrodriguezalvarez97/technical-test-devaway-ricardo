/* eslint-disable class-methods-use-this */
const RaceService = require('./RaceService');
const DriverService = require('./DriverService');

class ImportService {
  constructor({ raceService, driverService } = {}) {
    this.RaceService = raceService || new RaceService();
    this.DriverService = driverService || new DriverService();
  }

  /**
   * Given an array of races and a driverId parse the information to get the schema of a Race
   * @param {Array} driverRaces
   * @param {string} driverId
   */
  parseRaces(driverRaces, driverId) {
    return driverRaces.reduce((accumulator, race) => {
      const parsedLaps = this.parseLaps(race.laps, driverId);
      const raceObject = {
        name: race.name,
        laps: parsedLaps,
        drivers: [driverId]
      };

      accumulator.set(race.name, raceObject);

      return accumulator;
    }, new Map());
  }

  /**
   * Given an array of laps add the driverId to each lap.
   * @param {Array} driverLaps
   * @param {string} driverId
   */
  parseLaps(driverLaps, driverId) {
    return driverLaps.map((lap) => ({ time: lap.time, driver: driverId }));
  }

  /**
   * Update the races accumulator with the races of the last parsed driver
   * @param {Map} oldRacesAccumulator
   * @param {Map} newRacesData
   */
  updateRacesAccumulator(oldRacesAccumulator, newRacesData) {
    const entries = Array.from(newRacesData.entries());
    return entries.reduce((accumulator, [raceName, newRaceData]) => {
      const oldRaceObject = accumulator.get(raceName);
      if (!oldRaceObject) {
        accumulator.set(raceName, newRaceData);
        return accumulator;
      }

      const newRaceObject = {
        name: oldRaceObject.name,
        laps: oldRaceObject.laps.concat(newRaceData.laps),
        drivers: oldRaceObject.drivers.concat(newRaceData.drivers)
      };
      accumulator.set(newRaceObject.name, newRaceObject);
      return accumulator;
    }, oldRacesAccumulator);
  }

  /**
   * Validate the data and create the documents that will be saved into the database.
   *
   * @param {Array} driversAccumulator
   * @param {Map} racesAccumulator
   * @return {Array}
   */
  createDocs(driversAccumulator, racesAccumulator) {
    let docsToBeSaved;
    try {
      const driversDocs = driversAccumulator.map((driver) =>
        this.DriverService.createDoc(driver)
      );
      const racesDocs = Array.from(racesAccumulator.values()).map((race) =>
        this.RaceService.createDoc(race)
      );
      docsToBeSaved = driversDocs.concat(racesDocs);
    } catch (e) {
      console.log(e);
      throw e;
    }
    return docsToBeSaved;
  }

  /**
   * Given an array of documents return a promise that will settle after all documents have
   * been saved.
   * Ideally we can use this to make a transaction if we are using MongoDB 4.0+ & Mongoose 5.2.0+.
   * @param {Array} docs
   * @return {Promise}
   */
  writeDocs(docs) {
    return Promise.all(docs.map((doc) => doc.save()));
  }

  /**
   * Array of objects containing the data to be imported into the database.
   * @param {Array} data
   * @return {Array} empty array on failure and array of documents on success.
   */
  async import(data) {
    const driversAccumulator = [];
    let racesAccumulator = new Map();
    let result = [];

    for (let i = 0; i < data.length; i++) {
      const { races: driverRaces, ...driverInfo } = data[i];

      driversAccumulator.push(driverInfo);
      const newRaces = this.parseRaces(driverRaces, driverInfo._id);

      racesAccumulator = this.updateRacesAccumulator(
        racesAccumulator,
        newRaces
      );
    }
    try {
      const docs = this.createDocs(driversAccumulator, racesAccumulator);
      result = await this.writeDocs(docs);

      console.log('INFO: Data imported');
    } catch (e) {
      console.log('ERR: Unable to import data');
      console.log(e);
    }
    return result;
  }
}

module.exports = ImportService;
