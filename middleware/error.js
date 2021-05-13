const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  //makes a copy of the spread operator
  let error = { ...err };

  //
  error.message = err.message;

  //log error
  // console.log(err);

  //Mongoose bad  objectID
  if (err.name == "CastError") {
    const message = `Resource not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //DUPLICATE KEY
  if (err.code == 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  //validation error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
