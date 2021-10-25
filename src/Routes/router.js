const express = require('express');
const { importData, exportData } = require('../Controller/import.controller');

module.exports = () => {
  const router = express.Router();

  router.post('/import', importData);
  router.get('/export', exportData);
  return router;
};
