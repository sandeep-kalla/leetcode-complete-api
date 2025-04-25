/**
 * Problem controller
 * Handles HTTP requests for problem-related endpoints
 */
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { ProblemService, SubmissionService } = require('../services');
const { headersSchema, submissionRequestSchema } = require('../utils/validationSchemas');

/**
 * Get problem by title slug
 * @route GET /api/leetcode/problems/:titleSlug
 * @access Public
 */
const getProblemByTitleSlug = asyncHandler(async (req, res) => {
  const { titleSlug } = req.params;
  const problem = await ProblemService.fetchProblemByTitleSlug(titleSlug);
  res.status(StatusCodes.OK).json(problem);
});

/**
 * Submit solution for a problem
 * @route POST /api/leetcode/problems/submit
 * @access Public
 */
const submitProblemSolution = asyncHandler(async (req, res) => {
  // Get the title slug from the query parameters
  const { titleSlug } = req.query;
  if (!titleSlug) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Title slug is required');
  }
  
  // Validate submission data
  const { error, value: submissionData } = submissionRequestSchema.validate(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error(`Invalid submission data: ${error.message}`);
  }
  
  // Extract headers from request
  const headers = {
    cookie: req.headers.cookie,
    csrfToken: req.headers['x-csrftoken'],
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin,
    referer: req.headers.referer
  };
  
  // Validate headers
  const { error: headersError } = headersSchema.validate(headers);
  if (headersError) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error(`Invalid headers: ${headersError.message}`);
  }
  
  // Submit the solution
  const submissionResult = await SubmissionService.submitSolution(
    titleSlug,
    submissionData,
    headers
  );
  
  res.status(StatusCodes.OK).json(submissionResult);
});

/**
 * Submit solution as proxy
 * @route POST /api/leetcode/problems/submit-as-proxy
 * @access Public
 */
const submitProblemSolutionAsProxy = asyncHandler(async (req, res) => {
  const submissionData = req.body;
  
  // Extract title slug from the request body
  const { titleSlug } = submissionData;
  if (!titleSlug) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Title slug is required');
  }
  
  // Extract solution data
  const solutionData = {
    lang: submissionData.lang || 'cpp',
    question_id: submissionData.questionId,
    typed_code: submissionData.code
  };
  
  // Extract headers from the request body
  const headers = {
    cookie: submissionData.cookie,
    csrfToken: submissionData.csrfToken,
    userAgent: submissionData.userAgent,
    origin: submissionData.origin,
    referer: submissionData.referer
  };
  
  // Submit the solution
  const submissionResult = await SubmissionService.submitSolution(
    titleSlug,
    solutionData,
    headers
  );
  
  res.status(StatusCodes.OK).json(submissionResult);
});

module.exports = {
  getProblemByTitleSlug,
  submitProblemSolution,
  submitProblemSolutionAsProxy
};
