class CustomError extends Error {
  constructor({ code = 500, message = 'Server Error' }) {
    super();
    this.code = code;
    this.message = message;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }

  static handleError(error, res) {
    let code = 500;
    const { message } = error;
    if (error instanceof CustomError) {
      code = error.code;
    }
    console.log(message);
    console.log(error.stack);

    return res.status(code).json({ code, message });
  }
}
module.exports = CustomError;
