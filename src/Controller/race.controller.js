const RaceService = require('../Service/RaceService');
const CustomError = require('./CustomError');

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
  }
};
