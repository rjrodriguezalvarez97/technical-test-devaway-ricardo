const DriverModel = require('../Model/DriverModel');
const Service = require('./Service');

class DriverService extends Service {
  constructor(model) {
    super(model || DriverModel);
  }

  getAllDrivers() {
    return this.Model.find({});
  }

  getDriverById(id) {
    return this.Model.findById(id);
  }
}

module.exports = DriverService;
