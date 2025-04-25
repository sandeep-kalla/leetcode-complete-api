/**
 * Submission service
 * Handles interactions with the LeetCode API for code submissions
 */
const { httpClient, DEFAULT_HEADERS } = require('../utils/httpClient');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Submission service
 */
class SubmissionService {
  /**
   * Submit a solution to a LeetCode problem
   * @param {string} questionTitleSlug - Title slug of the problem
   * @param {Object} submissionData - Submission data
   * @param {Object} headers - Request headers
   * @returns {Promise<Object>} Submission result
   */
  static async submitSolution(questionTitleSlug, submissionData, headers) {
    try {
      const submissionUrl = `/problems/${questionTitleSlug}/submit/`;

      logger.info(`Submitting solution for problem: ${questionTitleSlug}`);

      // Format the submission data according to LeetCode's API requirements
      const formattedData = {
        lang: submissionData.lang,
        question_id: submissionData.question_id,
        typed_code: submissionData.typed_code
      };

      // Prepare request headers
      const requestHeaders = { ...DEFAULT_HEADERS };

      // Update Referer for this specific request
      requestHeaders['Referer'] = `${config.leetcode.baseUrl}/problems/${questionTitleSlug}/`;

      // Add cookie if provided
      if (headers.cookie) {
        requestHeaders['Cookie'] = headers.cookie;
      } else if (config.leetcode.cookie) {
        requestHeaders['Cookie'] = config.leetcode.cookie;
        logger.info('Using cookie from environment variables');
      }

      // Add CSRF token if provided
      if (headers.csrfToken) {
        requestHeaders['x-csrftoken'] = headers.csrfToken;
      } else if (config.leetcode.csrfToken) {
        requestHeaders['x-csrftoken'] = config.leetcode.csrfToken;
        logger.info('Using CSRF token from environment variables');
      }

      // Make submission request
      const response = await httpClient.post(submissionUrl, formattedData, {
        headers: requestHeaders
      });

      logger.info(`Submission response status: ${response.status}`);

      // Extract submission ID from response
      const submissionId = response.data.submission_id;

      if (!submissionId) {
        throw new Error('No submission ID returned from LeetCode');
      }

      // Check submission status
      return await this.checkSubmission(submissionId, headers);
    } catch (error) {
      logger.error(`Error submitting solution: ${error.message}`);
      throw new Error(`Failed to submit solution: ${error.message}`);
    }
  }

  /**
   * Submit a solution to a LeetCode problem and return the submission ID
   * @param {string} questionTitleSlug - Title slug of the problem
   * @param {Object} submissionData - Submission data
   * @param {Object} headers - Request headers
   * @returns {Promise<string>} Submission ID
   */
  static async submitSolutionAndGetId(questionTitleSlug, submissionData, headers) {
    try {
      const submissionUrl = `/problems/${questionTitleSlug}/submit/`;

      logger.info(`Submitting solution for problem: ${questionTitleSlug}`);

      // Format the submission data according to LeetCode's API requirements
      const formattedData = {
        lang: submissionData.lang,
        question_id: submissionData.question_id,
        typed_code: submissionData.typed_code
      };

      // Prepare request headers
      const requestHeaders = { ...DEFAULT_HEADERS };

      // Update Referer for this specific request
      requestHeaders['Referer'] = `${config.leetcode.baseUrl}/problems/${questionTitleSlug}/`;

      // Add cookie if provided
      if (headers.cookie) {
        requestHeaders['Cookie'] = headers.cookie;
      } else if (config.leetcode.cookie) {
        requestHeaders['Cookie'] = config.leetcode.cookie;
        logger.info('Using cookie from environment variables');
      }

      // Add CSRF token if provided
      if (headers.csrfToken) {
        requestHeaders['x-csrftoken'] = headers.csrfToken;
      } else if (config.leetcode.csrfToken) {
        requestHeaders['x-csrftoken'] = config.leetcode.csrfToken;
        logger.info('Using CSRF token from environment variables');
      }

      // Make submission request
      const response = await httpClient.post(submissionUrl, formattedData, {
        headers: requestHeaders
      });

      logger.info(`Submission response status: ${response.status}`);

      // Extract submission ID from response
      const submissionId = response.data.submission_id;

      if (!submissionId) {
        throw new Error('No submission ID returned from LeetCode');
      }

      // Return the submission ID
      return submissionId;
    } catch (error) {
      logger.error(`Error submitting solution: ${error.message}`);
      throw new Error(`Failed to submit solution: ${error.message}`);
    }
  }

  /**
   * Run code for a LeetCode problem without submitting it
   * @param {string} questionTitleSlug - Title slug of the problem
   * @param {Object} submissionData - Submission data
   * @param {Object} headers - Request headers
   * @returns {Promise<Object>} Run result
   */
  static async runCode(questionTitleSlug, submissionData, headers) {
    try {
      const runUrl = `/problems/${questionTitleSlug}/interpret_solution/`;

      logger.info(`Running code for problem: ${questionTitleSlug}`);

      // Format the submission data according to LeetCode's API requirements
      const formattedData = {
        lang: submissionData.lang,
        question_id: submissionData.question_id,
        typed_code: submissionData.typed_code,
        data_input: submissionData.data_input || ""
      };

      // Prepare request headers
      const requestHeaders = { ...DEFAULT_HEADERS };

      // Update Referer for this specific request
      requestHeaders['Referer'] = `${config.leetcode.baseUrl}/problems/${questionTitleSlug}/`;

      // Add cookie if provided
      if (headers.cookie) {
        requestHeaders['Cookie'] = headers.cookie;
      } else if (config.leetcode.cookie) {
        requestHeaders['Cookie'] = config.leetcode.cookie;
        logger.info('Using cookie from environment variables');
      }

      // Add CSRF token if provided
      if (headers.csrfToken) {
        requestHeaders['x-csrftoken'] = headers.csrfToken;
      } else if (config.leetcode.csrfToken) {
        requestHeaders['x-csrftoken'] = config.leetcode.csrfToken;
        logger.info('Using CSRF token from environment variables');
      }

      // Make run code request
      const response = await httpClient.post(runUrl, formattedData, {
        headers: requestHeaders
      });

      logger.info(`Run code response status: ${response.status}`);

      // Return the interpret_id and test_case
      return {
        interpret_id: response.data.interpret_id || "",
        test_case: response.data.test_case || "",
        status_code: response.status
      };
    } catch (error) {
      logger.error(`Error running code: ${error.message}`);
      throw new Error(`Failed to run code: ${error.message}`);
    }
  }

  /**
   * Check the result of a code run
   * @param {string} interpretId - Interpret ID
   * @param {Object} headers - Request headers
   * @returns {Promise<Object>} Run result
   */
  static async checkRunResult(interpretId, headers) {
    try {
      const checkUrl = `/submissions/detail/${interpretId}/check/`;

      logger.info(`Checking run result with ID: ${interpretId}`);

      // Prepare request headers
      const requestHeaders = { ...DEFAULT_HEADERS };

      // Update Referer for this specific request
      requestHeaders['Referer'] = `${config.leetcode.baseUrl}/submissions/detail/${interpretId}/`;

      // Add cookie if provided
      if (headers.cookie) {
        requestHeaders['Cookie'] = headers.cookie;
      } else if (config.leetcode.cookie) {
        requestHeaders['Cookie'] = config.leetcode.cookie;
        logger.info('Using cookie from environment variables');
      }

      // Add CSRF token if provided
      if (headers.csrfToken) {
        requestHeaders['x-csrftoken'] = headers.csrfToken;
      } else if (config.leetcode.csrfToken) {
        requestHeaders['x-csrftoken'] = config.leetcode.csrfToken;
        logger.info('Using CSRF token from environment variables');
      }

      // Make check request
      const response = await httpClient.get(checkUrl, {
        headers: requestHeaders
      });

      logger.info(`Check run result response status: ${response.status}`);

      return response.data;
    } catch (error) {
      logger.error(`Error checking run result: ${error.message}`);
      throw new Error(`Failed to check run result: ${error.message}`);
    }
  }

  /**
   * Check the status of a submission
   * @param {string} submissionId - Submission ID
   * @param {Object} headers - Request headers
   * @returns {Promise<Object>} Submission status
   */
  static async checkSubmission(submissionId, headers) {
    try {
      const checkUrl = `/submissions/detail/${submissionId}/check/`;

      logger.info(`Checking submission with ID: ${submissionId}`);

      // Prepare request headers
      const requestHeaders = { ...DEFAULT_HEADERS };

      // Update Referer for this specific request
      requestHeaders['Referer'] = `${config.leetcode.baseUrl}/submissions/detail/${submissionId}/`;

      // Add cookie if provided
      if (headers.cookie) {
        requestHeaders['Cookie'] = headers.cookie;
      } else if (config.leetcode.cookie) {
        requestHeaders['Cookie'] = config.leetcode.cookie;
        logger.info('Using cookie from environment variables');
      }

      // Add CSRF token if provided
      if (headers.csrfToken) {
        requestHeaders['x-csrftoken'] = headers.csrfToken;
      } else if (config.leetcode.csrfToken) {
        requestHeaders['x-csrftoken'] = config.leetcode.csrfToken;
        logger.info('Using CSRF token from environment variables');
      }

      // Make check request
      const response = await httpClient.get(checkUrl, {
        headers: requestHeaders
      });

      logger.info(`Check submission response status: ${response.status}`);

      // Log detailed submission status
      logger.info(`Submission status for ID ${submissionId}: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (error) {
      logger.error(`Error checking submission: ${error.message}`);
      throw new Error(`Failed to check submission: ${error.message}`);
    }
  }
}

module.exports = SubmissionService;
