/**
 * Routes index
 * Exports all routes from a single entry point
 */
const express = require('express');
const leetcodeRoutes = require('./leetcodeRoutes');
const problemRoutes = require('./problemRoutes');
const submissionRoutes = require('./submissionRoutes');
const questionsRoutes = require('./questionsRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

// Mount routes
router.use('/api/leetcode', leetcodeRoutes);
router.use('/api/leetcode/problems', problemRoutes);
router.use('/api/leetcode', submissionRoutes);
router.use('/api/leetcode/questions', questionsRoutes);
router.use('/api/leetcode', authRoutes);

module.exports = router;
