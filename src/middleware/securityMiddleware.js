/**
 * Security middleware
 * Provides security-related middleware for the application
 */
const cors = require('cors');
const helmet = require('helmet');

/**
 * Configure CORS middleware
 * @returns {Function} CORS middleware
 */
const configureCors = () => {
  return cors({
    origin: '*', // Allow all origins for now
    credentials: false, // Set to false when using allow_origins=["*"]
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrftoken'],
    exposedHeaders: ['Content-Type', 'Authorization']
  });
};

/**
 * Configure Helmet middleware
 * @returns {Function} Helmet middleware
 */
const configureHelmet = () => {
  return helmet({
    contentSecurityPolicy: false, // Disable CSP for now
    crossOriginEmbedderPolicy: false // Disable COEP for now
  });
};

module.exports = {
  configureCors,
  configureHelmet
};
