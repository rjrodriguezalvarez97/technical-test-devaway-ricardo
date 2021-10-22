const RaceModel = require('../Model/RaceModel');

// We could refactor this into a parent class
class RaceService {
  constructor(model) {
    this.Model = model || RaceModel;
  }

  createDoc(race) {
    const created = new this.Model(race);
    const error = created.validateSync();
    if (error) throw error;
    return created;
  }

  getRacesOfDriverQuery(driverId) {
    return this.Model.find({ drivers: driverId });
  }

  getAllRaces() {
    return this.Model.find({});
  }

  /**
   * Filter an array of races to get all of those that the driver raced
   * @param {Array} races
   * @param {String} driverId
   */
  getRacesOfDriver(races, driverId) {
    return races.filter((race) => race.drivers.includes(driverId));
  }

  /**
   * Get the laps of a Race Object that belong to the driver
   *
   * @param {Array} race
   * @param {String} driverId
   */
  extractDriversLapsOfRace(race, driverId) {
    return race.laps.reduce((accumulator, lap) => {
      if (lap.driver === driverId) {
        accumulator.push({ time: lap.time });
      }
      return accumulator;
    }, []);
  }
}
module.exports = RaceService;
