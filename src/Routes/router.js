const express = require('express');
const { importData, exportData } = require('../Controller/import.controller');
const {
  getRaceRanking,
  getChampionshipRanking,
  getDriverDetails,
  postRace
} = require('../Controller/race.controller');

const { postDriver } = require('../Controller/driver.controller');

module.exports = () => {
  const router = express.Router();

  router.post('/import', importData);
  router.get('/export', exportData);
  router.get('/ranking/race', getRaceRanking);
  router.get('/ranking/', getChampionshipRanking);
  router.get('/ranking/driver/:id', getDriverDetails);
  router.post('/driver/', postDriver);
  router.post('/race', postRace);

  return router;
};
