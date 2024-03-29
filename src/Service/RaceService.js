const RaceModel = require('../Model/RaceModel');
const Service = require('./ModelService');
const { TimeToSeconds, SecondsToTime, SortRanking } = require('./UtilsService');

class RaceService extends Service {
  constructor(model) {
    super(model || RaceModel);
  }

  addLap(race, driver, time) {
    const driverId = driver.id;
    if (!race.drivers.includes(driverId)) {
      race.drivers.push(driverId);
    }
    race.laps.push({ driver: driverId, time });
    return race.save();
  }

  getRacesOfDriverQuery(driverId) {
    return this.Model.find({ drivers: driverId }).populate('drivers');
  }

  getAllRaces() {
    return this.Model.find({}).populate('drivers');
  }

  getRaceByName(name) {
    return this.Model.findOne({ name }).populate('drivers');
  }

  /**
   * Filter an array of races to get all of those that the driver raced
   * @param {Array} races
   * @param {String} driverId
   */
  getRacesOfDriver(races, driverId) {
    return races.filter(
      (race) =>
        // drivers = [{id: '1234'}]
        race.drivers.filter((driver) => driver.id === driverId).length > 0
    );
    // return races.filter((race) => race.drivers.includes(driverId));
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
      if (i < POINTS.length) {
        ranking[i].points += POINTS[i];
      }
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
      const driverId = driver.id;
      const laps = this.extractDriversLapsOfRace(race, driverId);
      const totalTime = parseFloat(
        laps
          .reduce(
            (accumulator, lap) => accumulator + TimeToSeconds(lap.time),
            0
          )
          .toFixed(3)
      );
      const bestLap = this.getBestLap(laps);

      return {
        driver,
        totalTime,
        totalTimeString: SecondsToTime(totalTime),
        bestLap,
        points: 0
      };
    });
  }

  /**
   * Format totalTime as String
   * @param {Array} ranking
   */
  formatTotalTime(ranking) {
    return ranking.map((driver) => ({
      ...driver,
      totalTimeString: SecondsToTime(driver.totalTime)
    }));
  }

  /**
   * Get the ranking of a race
   * @param {Race} race
   */
  getRaceRanking(race) {
    const drivers = this.calculateDriversTimeAndBestLap(race);
    const ranking = this.calculatePointsOfRace(drivers);

    return { _id: race._id, name: race.name, ranking };
  }

  /**
   * Given an array of ranks(final poisition of a driver for a given race) calculate
   * the total points and time of a driver and return an array with the final ranking sorted
   * by points
   * @param {Array} races
   */
  calculateChampionshipRanking(ranks) {
    const map = ranks.reduce((accumulator, rank) => {
      const oldDriverData = accumulator.get(rank.driver.id);
      if (!oldDriverData) {
        // delete rank.bestLap;
        const { bestLap, ...rankWithoutBestLap } = rank;

        accumulator.set(rank.driver.id, rankWithoutBestLap);
        return accumulator;
      }
      const totalTime = parseFloat(
        (oldDriverData.totalTime + rank.totalTime).toFixed(3)
      );

      const newData = {
        ...oldDriverData,
        totalTime,
        points: oldDriverData.points + rank.points
      };

      accumulator.set(rank.driver.id, newData);
      return accumulator;
    }, new Map());

    const sorted = SortRanking(Array.from(map.values()));
    const sortedWithTimeString = this.formatTotalTime(sorted);

    return sortedWithTimeString;
  }

  /**
   * Get the ranking of the championship
   */
  async getChampionshipRanking() {
    const races = await this.getAllRaces();

    // array of rankings, each ranking has the position(rank) of each driver
    const rankingOfRaces = races.map(
      (race) => this.getRaceRanking(race).ranking
    );

    const ranking = this.calculateChampionshipRanking(rankingOfRaces.flat());

    return ranking;
  }

  /**
   * Get all the driver's rank of a championship
   * @param {Driver} driver
   */
  async getDriverDetails(driver) {
    const { id: driverId } = driver;
    const races = await this.getRacesOfDriverQuery(driverId);
    const rankingOfRaces = races.map((race) => this.getRaceRanking(race));
    const ranksOfDriver = rankingOfRaces.reduce((acc, race) => {
      for (let i = 0; i < race.ranking.length; i++) {
        const ranking = race.ranking[i];
        if (ranking.driver.id === driverId) {
          const { driver: _, ...rest } = ranking;
          acc.push({ name: race.name, ...rest });
          break;
        }
      }
      return acc;
    }, []);
    return { driver, races: ranksOfDriver };
  }
}
module.exports = RaceService;
