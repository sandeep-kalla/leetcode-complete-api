/**
 * Configuration module
 * Centralizes all configuration settings for the application
 */
require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 8000,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
  },
  leetcode: {
    graphqlUrl: process.env.LEETCODE_GRAPHQL || 'https://leetcode.com/graphql',
    baseUrl: process.env.LEETCODE_BASE_URL || 'https://leetcode.com',
    csrfToken: process.env.LEETCODE_CSRF_TOKEN || '',
    cookie: process.env.LEETCODE_COOKIE || '',
    userAgent: process.env.LEETCODE_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    origin: process.env.LEETCODE_ORIGIN || 'https://leetcode.com',
    referer: process.env.LEETCODE_REFERER || 'https://leetcode.com/problems/two-sum/',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

module.exports = config;
