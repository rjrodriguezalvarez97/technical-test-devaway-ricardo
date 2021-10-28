const CustomError = require('../Controller/CustomError');

const checkEmptyBody = (req, res, next) => {
  const { body } = req;
  if (body.constructor === Object && Object.keys(body).length === 0) {
    const error = new CustomError({
      code: 400,
      message: 'Body is empty'
    });
    return CustomError.handleError(error, res);
  }
  return next();
};

module.exports = { checkEmptyBody };
