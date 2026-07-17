import AppError from '../utils/AppError.js';

const handleCastError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value} is not a valid ID`, 400);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map(e => e.message);
  return new AppError(messages[0], 400);
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists — please use a different value`, 400);
};

const errorMiddleware = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  let error = err;
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  console.error('UNEXPECTED ERROR:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.'
  });
};

export default errorMiddleware;
