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

  /**
   * Method that will return all the championship information as an Array of Objects
   * following the import format.
   */
  async export() {
    const drivers = await this.DriverService.getAllDrivers();
    const races = await this.RaceService.getAllRaces();
    const data = drivers.reduce((accumulator, driver) => {
      const exportedDriver = this.exportDriver(races, driver);
      accumulator.push(exportedDriver);
      return accumulator;
    }, []);

    return data;
  }

  /**
   * Given all the races of the championship and a driver get an Object
   * with all the information of the driver
   *
   * @param {Array} races
   * @param {DriverModel} driver
   */
  exportDriver(races, driver) {
    const filteredRaces = this.RaceService.getRacesOfDriver(races, driver.id);
    const formattedRaces = this.formatDriverRacesForExport(
      filteredRaces,
      driver.id
    );

    const exportedDriver = {
      _id: driver.id,
      name: driver.name,
      team: driver.team,
      age: driver.age,
      picture: driver.picture,
      races: formattedRaces
    };

    return exportedDriver;
  }

  /**
   * Given the races in which the driver participates get an array fo races with the format
   * of the import json.
   * @param {*} races
   * @param {*} driverId
   */
  formatDriverRacesForExport(races, driverId) {
    const unsorted = races.reduce((accumulator, race) => {
      const laps = this.RaceService.extractDriversLapsOfRace(race, driverId);
      accumulator.push({ name: race.name, laps });
      return accumulator;
    }, []);
    return unsorted.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }
}

module.exports = ImportService;
