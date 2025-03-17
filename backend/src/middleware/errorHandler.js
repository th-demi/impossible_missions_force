const { errorResponse } = require('../utils/responseFormatter');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json(errorResponse(`Validation Error: ${errors.join(', ')}`, 400));
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json(errorResponse('Database Error: ' + err.message, 500));
  }
  
  // Default error response
  return res.status(500).json(errorResponse(err.message || 'Internal Server Error', 500));
};

module.exports = errorHandler;