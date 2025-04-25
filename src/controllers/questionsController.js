/**
 * Questions controller
 * Handles HTTP requests for questions-related endpoints
 */
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { QuestionsService } = require('../services');
const { questionFiltersSchema } = require('../utils/validationSchemas');

/**
 * Get all LeetCode questions
 * @route GET /api/leetcode/questions
 * @access Public
 */
const getAllQuestions = asyncHandler(async (req, res) => {
  // Extract query parameters
  const category = req.query.category || 'all-code-essentials';
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 100;
  
  // Validate page and pageSize
  if (page < 1) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Page must be greater than or equal to 1');
  }
  
  if (pageSize < 1 || pageSize > 500) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Page size must be between 1 and 500');
  }
  
  // Calculate skip based on page and pageSize
  const skip = (page - 1) * pageSize;
  
  // Extract filters
  const filters = {
    difficulty: req.query.difficulty,
    search: req.query.search
  };
  
  // Validate filters
  const { error, value: validatedFilters } = questionFiltersSchema.validate(filters);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error(`Invalid filters: ${error.message}`);
  }
  
  // Fetch questions
  const questions = await QuestionsService.getAllQuestions(
    category,
    skip,
    pageSize,
    validatedFilters
  );
  
  res.status(StatusCodes.OK).json(questions);
});

module.exports = {
  getAllQuestions
};
