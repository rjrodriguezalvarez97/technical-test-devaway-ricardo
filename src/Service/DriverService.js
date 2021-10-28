const DriverModel = require('../Model/DriverModel');
const Service = require('./ModelService');

class DriverService extends Service {
  constructor(model) {
    super(model || DriverModel);
  }

  getAllDrivers() {
    return this.Model.find({});
  }
}

module.exports = DriverService;
