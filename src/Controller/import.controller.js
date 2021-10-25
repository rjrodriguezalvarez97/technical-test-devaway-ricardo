const ImportService = require('../Service/ImportService');

const importService = new ImportService();
module.exports = {
  async importData(req, res) {
    try {
      const data = req.body;
      const docs = await importService.import(data);
      if (docs.length === 0) throw Error('Import failed. Try again later');
      res.json({ message: 'Data imported succesfully', docs });
    } catch (e) {
      console.log(e);

      res.status(500).json({ message: e.message });
    }
  },

  async exportData(req, res) {
    try {
      const data = await importService.export();
      if (data.length === 0) throw Error('Export failed. Try again later');
      res.json(data);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
    }
  }
};
