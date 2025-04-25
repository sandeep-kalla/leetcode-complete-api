/**
 * Authentication controller
 * Handles HTTP requests for authentication-related endpoints
 */
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { AuthService } = require('../services');
const { headersSchema } = require('../utils/validationSchemas');

/**
 * Check LeetCode authentication status
 * @route GET /api/leetcode/auth-check
 * @access Public
 */
const checkAuthentication = asyncHandler(async (req, res) => {
  // Extract headers from request
  const headers = {
    cookie: req.headers.cookie,
    csrfToken: req.headers['x-csrftoken'],
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin,
    referer: req.headers.referer
  };
  
  // Validate headers
  const { error } = headersSchema.validate(headers);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error(`Invalid headers: ${error.message}`);
  }
  
  // Check authentication
  const authStatus = await AuthService.checkAuthentication(headers);
  
  res.status(StatusCodes.OK).json(authStatus);
});

/**
 * Fetch cookies from LeetCode
 * @route GET /api/leetcode/fetch-cookies
 * @access Public
 */
const fetchCookiesFromLeetcode = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "This endpoint is for documentation purposes only. In the browser version, this would help fetch cookies from LeetCode.",
    instructions: "To authenticate with LeetCode, you need to provide your LeetCode cookies in the request headers."
  });
});

module.exports = {
  checkAuthentication,
  fetchCookiesFromLeetcode
};
