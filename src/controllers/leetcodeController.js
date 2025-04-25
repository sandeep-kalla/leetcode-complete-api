/**
 * LeetCode controller
 * Handles HTTP requests for LeetCode-related endpoints
 */
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { LeetCodeService } = require('../services');

/**
 * Get daily LeetCode challenge
 * @route GET /api/leetcode/daily
 * @access Public
 */
const getDailyChallenge = asyncHandler(async (req, res) => {
  const dailyChallenge = await LeetCodeService.fetchDailyChallenge();
  res.status(StatusCodes.OK).json(dailyChallenge);
});

module.exports = {
  getDailyChallenge
};
