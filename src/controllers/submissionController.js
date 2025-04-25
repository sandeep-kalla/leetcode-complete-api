/**
 * Submission controller
 * Handles HTTP requests for submission-related endpoints
 */
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { SubmissionService } = require('../services');
const { headersSchema, submissionRequestSchema } = require('../utils/validationSchemas');

/**
 * Run code for a problem
 * @route POST /api/leetcode/run-code/:questionTitleSlug
 * @access Public
 */
const runCode = asyncHandler(async (req, res) => {
  const { questionTitleSlug } = req.params;

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

  // Run the code
  const runResult = await SubmissionService.runCode(
    questionTitleSlug,
    submissionData,
    headers
  );

  res.status(StatusCodes.OK).json(runResult);
});

/**
 * Submit code for a problem
 * @route POST /api/leetcode/submit/:questionTitleSlug
 * @access Public
 */
const submitSolution = asyncHandler(async (req, res) => {
  const { questionTitleSlug } = req.params;

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

  try {
    // Submit the solution and get the submission ID
    const submissionId = await SubmissionService.submitSolutionAndGetId(
      questionTitleSlug,
      submissionData,
      headers
    );

    // Set the submission ID in the response headers
    res.setHeader('X-Submission-ID', submissionId);

    // Return the submission ID to the client
    res.status(StatusCodes.OK).json({
      submission_id: submissionId,
      state: 'PENDING'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    throw new Error(`Failed to submit solution: ${error.message}`);
  }
});

/**
 * Check submission status
 * @route GET /api/leetcode/submissions/:submissionId/check
 * @access Public
 */
const checkSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

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

  // Check the submission
  const submissionStatus = await SubmissionService.checkSubmission(
    submissionId,
    headers
  );

  // Set the submission ID in the response headers
  res.setHeader('X-Submission-ID', submissionId);

  // Log the submission status
  console.log(`Submission status for ID ${submissionId}:`, JSON.stringify(submissionStatus));

  res.status(StatusCodes.OK).json(submissionStatus);
});

/**
 * Check run code result
 * @route GET /api/leetcode/run-code/check/:interpretId
 * @access Public
 */
const checkRunResult = asyncHandler(async (req, res) => {
  const { interpretId } = req.params;

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

  // Check the run result
  const runResult = await SubmissionService.checkRunResult(
    interpretId,
    headers
  );

  res.status(StatusCodes.OK).json(runResult);
});

/**
 * Get latest submission ID
 * @route GET /api/leetcode/submissions/latest
 * @access Public
 */
const getLatestSubmissionId = asyncHandler(async (req, res) => {
  // This is a placeholder endpoint that would normally fetch the latest submission ID
  // Since we don't have a way to get this directly, we'll return a 404
  res.status(StatusCodes.NOT_FOUND);
  throw new Error('Not implemented');
});

module.exports = {
  runCode,
  submitSolution,
  checkSubmission,
  checkRunResult,
  getLatestSubmissionId
};
