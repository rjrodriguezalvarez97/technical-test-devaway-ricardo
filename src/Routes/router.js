const express = require('express');
const { importData, exportData } = require('../Controller/import.controller');
const {
  getRaceRanking,
  getChampionshipRanking
} = require('../Controller/race.controller');

module.exports = () => {
  const router = express.Router();

  router.post('/import', importData);
  router.get('/export', exportData);
  router.get('/ranking/race', getRaceRanking);
  router.get('/ranking/', getChampionshipRanking);

  return router;
};
