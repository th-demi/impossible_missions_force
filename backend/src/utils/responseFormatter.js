/**
 * Format a success response
 * @param {*} data The data to include in the response
 * @param {string} message Success message
 * @returns {Object} Formatted response object
 */
const successResponse = (data, message = 'Operation successful') => {
    return {
      success: true,
      message,
      data
    };
  };
  
  /**
   * Format an error response
   * @param {string} message Error message
   * @param {number} statusCode HTTP status code
   * @returns {Object} Formatted error object
   */
  const errorResponse = (message, statusCode = 500) => {
    return {
      success: false,
      message,
      statusCode
    };
  };
  
  module.exports = {
    successResponse,
    errorResponse
  };