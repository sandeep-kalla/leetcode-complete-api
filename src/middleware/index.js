/**
 * Middleware index
 * Exports all middleware from a single entry point
 */
const { notFound, errorHandler } = require('./errorHandler');
const { configureCors, configureHelmet } = require('./securityMiddleware');

module.exports = {
  notFound,
  errorHandler,
  configureCors,
  configureHelmet
};
