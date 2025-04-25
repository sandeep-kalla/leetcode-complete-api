/**
 * Error handling middleware
 * Provides centralized error handling for the application
 */
const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');

/**
 * Not found middleware
 * Handles 404 errors for routes that don't exist
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(StatusCodes.NOT_FOUND);
  next(error);
};

/**
 * Error handler middleware
 * Handles all errors in the application
 */
const errorHandler = (err, req, res, next) => {
  // Log the error but don't expose details to the client
  logger.error(`Error: ${err.message}`);
  logger.debug(err.stack);

  const statusCode = res.statusCode === StatusCodes.OK ? 
    StatusCodes.INTERNAL_SERVER_ERROR : res.statusCode;

  res.status(statusCode).json({
    error: 'Something went wrong!',
    detail: process.env.NODE_ENV === 'production' ? 
      'An internal server error occurred' : err.message
  });
};

module.exports = {
  notFound,
  errorHandler
};
