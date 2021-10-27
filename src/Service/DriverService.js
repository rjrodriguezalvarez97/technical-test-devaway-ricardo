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

  createDocAndSave(driver) {
    const created = this.createDoc(driver);
    return created.save();
  }

  getAllDrivers() {
    return this.Model.find({});
  }

  getDriverById(id) {
    return this.Model.findById(id);
  }
}

module.exports = DriverService;
