/**
 * Authentication service
 * Handles interactions with the LeetCode API for authentication
 */
const { graphqlClient, DEFAULT_HEADERS } = require('../utils/httpClient');
const logger = require('../utils/logger');

/**
 * Authentication service
 */
class AuthService {
  /**
   * Check if the user is authenticated with LeetCode
   * @param {Object} headers - Request headers
   * @returns {Promise<Object>} Authentication status
   */
  static async checkAuthentication(headers) {
    try {
      logger.info('Checking LeetCode authentication status');
      
      const query = {
        query: `
          query getUserProfile {
            userStatus {
              userId
              username
              isSignedIn
            }
          }
        `
      };
      
      // Extract the CSRF token from the cookie if it's not provided in the headers
      let csrfToken = headers.csrfToken;
      if (!csrfToken && headers.cookie) {
        const csrfCookie = headers.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
        if (csrfCookie) {
          csrfToken = csrfCookie.split('=')[1].trim();
          logger.info('Extracted CSRF token from cookie');
        }
      }
      
      // Prepare request headers
      const requestHeaders = { ...DEFAULT_HEADERS };
      
      // Add cookie if provided
      if (headers.cookie) {
        requestHeaders['Cookie'] = headers.cookie;
      }
      
      // Add CSRF token if available
      if (csrfToken) {
        requestHeaders['x-csrftoken'] = csrfToken;
      }
      
      // Add user agent if provided
      if (headers.userAgent) {
        requestHeaders['User-Agent'] = headers.userAgent;
      }
      
      // Add origin if provided
      if (headers.origin) {
        requestHeaders['Origin'] = headers.origin;
      }
      
      // Add referer if provided
      if (headers.referer) {
        requestHeaders['Referer'] = headers.referer;
      }
      
      // Make authentication check request
      const response = await graphqlClient.post('', query, {
        headers: requestHeaders
      });
      
      const data = response.data;
      const userStatus = data?.data?.userStatus;
      
      if (!userStatus) {
        logger.error('Invalid response format from LeetCode API');
        return {
          isSignedIn: false,
          error: 'Invalid response from LeetCode API'
        };
      }
      
      logger.info(`Authentication status: ${userStatus.isSignedIn ? 'Signed in' : 'Not signed in'}`);
      
      return {
        isSignedIn: userStatus.isSignedIn,
        username: userStatus.username,
        userId: userStatus.userId
      };
    } catch (error) {
      logger.error(`Error checking authentication: ${error.message}`);
      
      return {
        isSignedIn: false,
        error: `Failed to check authentication: ${error.message}`
      };
    }
  }
}

module.exports = AuthService;
