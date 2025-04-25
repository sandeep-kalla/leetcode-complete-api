/**
 * Main application entry point
 */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const { notFound, errorHandler, configureCors, configureHelmet } = require('./middleware');
const logger = require('./utils/logger');

// Create Express app
const app = express();

// Apply middleware
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body
app.use(configureCors()); // Configure CORS
app.use(configureHelmet()); // Configure Helmet security headers

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../static')));

// Mount API routes
app.use(routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to LeetCode API Server' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Apply error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.server.port;
const HOST = config.server.host;

app.listen(PORT, HOST, () => {
  logger.info(`✅ Server running on http://${HOST}:${PORT}`);
  logger.info(`Environment: ${config.server.env}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

module.exports = app; // Export for testing
