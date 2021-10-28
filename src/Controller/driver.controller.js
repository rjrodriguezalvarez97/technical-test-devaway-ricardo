const CustomError = require('./CustomError');
const DriverService = require('../Service/DriverService');

const driverService = new DriverService();
module.exports = {
  async postDriver(req, res) {
    const { body } = req;
    try {
      if (body.constructor === Object && Object.keys(body).length === 0) {
        throw new CustomError({
          code: 400,
          message: 'Body is empty'
        });
      }

      if (body.name === '') {
        throw new CustomError({
          code: 400,
          message: 'name is required'
        });
      }
      const driver = await driverService.createDocAndSave(body);

      return res.json(driver);
    } catch (err) {
      return CustomError.handleError(err, res);
    }
  }
};
