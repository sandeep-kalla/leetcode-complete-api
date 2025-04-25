/**
 * Submission routes
 * Defines routes for submission-related endpoints
 */
const express = require('express');
const { submissionController } = require('../controllers');

const router = express.Router();

/**
 * @route   POST /api/leetcode/run-code/:questionTitleSlug
 * @desc    Run code for a problem
 * @access  Public
 */
router.post('/run-code/:questionTitleSlug', submissionController.runCode);

/**
 * @route   POST /api/leetcode/submit/:questionTitleSlug
 * @desc    Submit code for a problem
 * @access  Public
 */
router.post('/submit/:questionTitleSlug', submissionController.submitSolution);

/**
 * @route   GET /api/leetcode/submissions/:submissionId/check
 * @desc    Check submission status
 * @access  Public
 */
router.get('/submissions/:submissionId/check', submissionController.checkSubmission);

/**
 * @route   GET /api/leetcode/run-code/check/:interpretId
 * @desc    Check run code result
 * @access  Public
 */
router.get('/run-code/check/:interpretId', submissionController.checkRunResult);

/**
 * @route   GET /api/leetcode/submissions/latest
 * @desc    Get latest submission ID
 * @access  Public
 */
router.get('/submissions/latest', submissionController.getLatestSubmissionId);

module.exports = router;
