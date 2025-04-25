/**
 * HTTP Client utility
 * Provides a centralized mechanism for making HTTP requests
 */
const axios = require('axios');
const logger = require('./logger');
const config = require('../config');

// Create default headers
const DEFAULT_HEADERS = {
  'x-csrftoken': config.leetcode.csrfToken,
  'User-Agent': config.leetcode.userAgent,
  'Origin': config.leetcode.origin,
  'Referer': config.leetcode.referer,
  'Content-Type': 'application/json',
  'Host': 'leetcode.com',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'sec-ch-ua': '"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin'
};

/**
 * Create an HTTP client with default configuration
 */
const createHttpClient = (baseURL = config.leetcode.baseUrl, timeout = 30000) => {
  const client = axios.create({
    baseURL,
    timeout,
    headers: DEFAULT_HEADERS
  });

  // Add request interceptor
  client.interceptors.request.use(
    (config) => {
      logger.debug(`Making ${config.method.toUpperCase()} request to ${config.url}`);
      return config;
    },
    (error) => {
      logger.error(`Request error: ${error.message}`);
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  client.interceptors.response.use(
    (response) => {
      logger.debug(`Received response from ${response.config.url} with status ${response.status}`);
      return response;
    },
    (error) => {
      if (error.response) {
        logger.error(`Response error: ${error.response.status} - ${error.message}`);
      } else if (error.request) {
        logger.error(`Request error: No response received - ${error.message}`);
      } else {
        logger.error(`Error: ${error.message}`);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Create default HTTP client
const httpClient = createHttpClient();

// Create GraphQL client
const graphqlClient = createHttpClient(config.leetcode.graphqlUrl);

module.exports = {
  httpClient,
  graphqlClient,
  createHttpClient,
  DEFAULT_HEADERS
};
