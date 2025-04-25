/**
 * Problem routes
 * Defines routes for problem-related endpoints
 */
const express = require('express');
const { problemController } = require('../controllers');

const router = express.Router();

/**
 * @route   GET /api/leetcode/problems/:titleSlug
 * @desc    Get problem by title slug
 * @access  Public
 */
router.get('/:titleSlug', problemController.getProblemByTitleSlug);

/**
 * @route   POST /api/leetcode/problems/submit
 * @desc    Submit solution for a problem
 * @access  Public
 */
router.post('/submit', problemController.submitProblemSolution);

/**
 * @route   POST /api/leetcode/problems/submit-as-proxy
 * @desc    Submit solution as proxy
 * @access  Public
 */
router.post('/submit-as-proxy', problemController.submitProblemSolutionAsProxy);

module.exports = router;
