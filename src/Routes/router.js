const express = require('express');
const { importData, exportData } = require('../Controller/import.controller');
const {
  getRaceRanking,
  getChampionshipRanking,
  getDriverDetails,
  postRace,
  postLap
} = require('../Controller/race.controller');
const { checkEmptyBody } = require('./middlewares');

const { postDriver } = require('../Controller/driver.controller');

module.exports = () => {
  const router = express.Router();

  router.post('/import', importData);
  router.get('/export', exportData);
  router.get('/ranking/race', getRaceRanking);
  router.get('/ranking/', getChampionshipRanking);
  router.get('/ranking/driver/:id', getDriverDetails);
  router.post('/driver/', checkEmptyBody, postDriver);
  router.post('/race', checkEmptyBody, postRace);
  router.post('/race/:id/laps', postLap);

  return router;
};
