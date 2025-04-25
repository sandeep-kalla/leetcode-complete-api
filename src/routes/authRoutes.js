/**
 * Authentication routes
 * Defines routes for authentication-related endpoints
 */
const express = require('express');
const { authController } = require('../controllers');

const router = express.Router();

/**
 * @route   GET /api/leetcode/auth-check
 * @desc    Check LeetCode authentication status
 * @access  Public
 */
router.get('/auth-check', authController.checkAuthentication);

/**
 * @route   GET /api/leetcode/fetch-cookies
 * @desc    Fetch cookies from LeetCode
 * @access  Public
 */
router.get('/fetch-cookies', authController.fetchCookiesFromLeetcode);

module.exports = router;
