/**
 * Questions routes
 * Defines routes for questions-related endpoints
 */
const express = require('express');
const { questionsController } = require('../controllers');

const router = express.Router();

/**
 * @route   GET /api/leetcode/questions
 * @desc    Get all LeetCode questions
 * @access  Public
 */
router.get('/', questionsController.getAllQuestions);

module.exports = router;
