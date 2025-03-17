const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const { errorResponse } = require('../utils/responseFormatter');
const User = require('../models/user');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(errorResponse('Access denied. No token provided.', 401));
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Find user by ID
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json(errorResponse('Invalid token. User not found.', 401));
    }
    
    // Add user to request object
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(errorResponse('Token expired', 401));
    }
    
    return res.status(401).json(errorResponse('Invalid token', 401));
  }
};

/**
 * Middleware to authorize admin users
 */
const authorize = (roles = ['admin']) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(errorResponse('Unauthorized. Please authenticate.', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(errorResponse('Forbidden. Insufficient permissions.', 403));
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};