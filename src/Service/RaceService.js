const RaceModel = require('../Model/RaceModel');

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
}
module.exports = RaceService;
