/**
 * LeetCode routes
 * Defines routes for LeetCode-related endpoints
 */
const express = require('express');
const { leetcodeController } = require('../controllers');

const router = express.Router();

/**
 * @route   GET /api/leetcode/daily
 * @desc    Get daily LeetCode challenge
 * @access  Public
 */
router.get('/daily', leetcodeController.getDailyChallenge);

module.exports = router;
