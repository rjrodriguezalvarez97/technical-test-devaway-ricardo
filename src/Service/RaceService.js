const RaceModel = require('../Model/RaceModel');
const { TimeToSeconds, SecondsToTime } = require('./UtilsService');
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

  /**
   * Given an array of laps object { time: '00:14:04.123} get the min value.
   * @param {Array} laps
   */
  getBestLap(laps) {
    const bestLapTime = laps.reduce((bestTime, lap) => {
      const lapTime = TimeToSeconds(lap.time);
      return bestTime < lapTime ? bestTime : lapTime;
    }, Number.MAX_SAFE_INTEGER);

    return SecondsToTime(bestLapTime);
  }

  /**
   * Calculate the points and ranking order of a race
   * @param {Array} drivers
   */
  calculatePointsOfRace(drivers) {
    const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    const POINTSFASTESTLAP = 1;
    let indexFastestLap = -1;
    let fastestLap = Number.MAX_SAFE_INTEGER;

    const ranking = drivers.sort((driverA, driverB) => {
      if (driverA.totalTime < driverB.totalTime) return -1;
      if (driverA.totalTime > driverB.totalTime) return 1;

      return 0;
    });

    for (let i = 0; i < ranking.length; i++) {
      ranking[i].points += POINTS[i];
      const lapTime = TimeToSeconds(ranking[i].bestLap);
      if (lapTime < fastestLap) {
        fastestLap = lapTime;
        indexFastestLap = i;
      }
    }
    ranking[indexFastestLap].points += POINTSFASTESTLAP;

    return ranking;
  }

  /**
   * Calculate the drivers' total time and best lap.
   * @param {Race} race
   */
  calculateDriversTimeAndBestLap(race) {
    return race.drivers.map((driver) => {
      const laps = this.extractDriversLapsOfRace(race, driver);
      const totalTime = laps.reduce(
        (accumulator, lap) => accumulator + TimeToSeconds(lap.time),
        0
      );
      const bestLap = this.getBestLap(laps);

      return {
        driver,
        totalTime,
        bestLap,
        points: 0
      };
    });
  }
}
module.exports = RaceService;
