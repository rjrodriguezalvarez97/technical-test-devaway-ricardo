const ImportService = require('../Service/ImportService');
const CustomError = require('./CustomError');

const importService = new ImportService();
module.exports = {
  async importData(req, res) {
    try {
      const data = req.body;
      if (data.length === 0) {
        throw new CustomError({ code: 400, message: 'body is empty' });
      }

      const docs = await importService.import(data);
      if (docs.length === 0) {
        throw new CustomError({
          code: 500,
          message: 'Import failed. Try again later'
        });
      }

      return res.json({ message: 'Data imported succesfully', docs });
    } catch (err) {
      return CustomError.handleError(err, res);
    }
  },

  async exportData(req, res) {
    try {
      const data = await importService.export();
      if (data.length === 0) {
        throw new CustomError({
          code: 500,
          message: 'Import failed. Try again later'
        });
      }
      return res.json(data);
    } catch (err) {
      return CustomError.handleError(err, res);
    }
  }
};
