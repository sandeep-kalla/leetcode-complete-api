/**
 * Controllers index
 * Exports all controllers from a single entry point
 */
const leetcodeController = require('./leetcodeController');
const problemController = require('./problemController');
const submissionController = require('./submissionController');
const questionsController = require('./questionsController');
const authController = require('./authController');

module.exports = {
  leetcodeController,
  problemController,
  submissionController,
  questionsController,
  authController
};
