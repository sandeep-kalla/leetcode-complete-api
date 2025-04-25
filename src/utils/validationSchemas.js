/**
 * Validation schemas
 * Defines Joi validation schemas for request validation
 */
const Joi = require('joi');

// Headers validation schema
const headersSchema = Joi.object({
  cookie: Joi.string().allow('', null),
  csrfToken: Joi.string().allow('', null),
  userAgent: Joi.string().allow('', null),
  origin: Joi.string().allow('', null),
  referer: Joi.string().allow('', null)
});

// Submission request validation schema
const submissionRequestSchema = Joi.object({
  lang: Joi.string().default('cpp'),
  question_id: Joi.string().required(),
  typed_code: Joi.string().required(),
  data_input: Joi.string().allow('', null)
});

// Question filters validation schema
const questionFiltersSchema = Joi.object({
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').allow(null),
  search: Joi.string().allow('', null)
});

module.exports = {
  headersSchema,
  submissionRequestSchema,
  questionFiltersSchema
};
