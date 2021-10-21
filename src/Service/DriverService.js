const DriverModel = require('../Model/DriverModel');

class DriverService {
  constructor(model) {
    this.Model = model || DriverModel;
  }

  createDoc(driver) {
    const created = new this.Model(driver);
    const error = created.validateSync();
    if (error) throw error;
    return created;
  }
}

module.exports = DriverService;
