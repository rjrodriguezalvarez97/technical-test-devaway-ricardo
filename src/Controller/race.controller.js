const RaceService = require('../Service/RaceService');
const CustomError = require('./CustomError');
const DriverService = require('../Service/DriverService');

const driverService = new DriverService();
const raceService = new RaceService();
module.exports = {
  async getRaceRanking(req, res) {
    try {
      const { name } = req.query;
      if (!name) {
        throw new CustomError({
          code: 400,
          message: 'Missing race name on query parameter'
        });
      }
      const race = await raceService.getRaceByName(name);
      if (!race) {
        throw new CustomError({
          code: 404,
          message: 'Race not found'
        });
      }
      const raceRanking = await raceService.getRaceRanking(race);
      return res.json(raceRanking);
    } catch (err) {
      return CustomError.handleError(err, res);
    }
  },
  async getChampionshipRanking(req, res) {
    try {
      const championship = await raceService.getChampionshipRanking();
      if (!championship) {
        throw new CustomError({
          code: 500,
          message: "Couldn't retrieve championship ranking"
        });
      }
      return res.json(championship);
    } catch (err) {
      return CustomError.handleError(err, res);
    }
  },
  async getDriverDetails(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        throw new CustomError({
          code: 400,
          message: 'Missing driver id'
        });
      }
      const driver = await driverService.getDriverById(id);
      if (!driver) {
        throw new CustomError({
          code: 404,
          message: 'Driver not found'
        });
      }
      const driverDetails = await raceService.getDriverDetails(driver);

      return res.json(driverDetails);
    } catch (err) {
      return CustomError.handleError(err, res);
    }
  },
  async postRace(req, res) {
    const { body } = req;
    try {
      if (body.constructor === Object && Object.keys(body).length === 0) {
        throw new CustomError({
          code: 400,
          message: 'Body is empty'
        });
      }
      const driver = await raceService.createDocAndSave(body);

      return res.json(driver);
    } catch (err) {
      return CustomError.handleError(err, res);
    }
  }
};
