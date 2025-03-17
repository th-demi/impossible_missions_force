const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecret, jwtExpiration } = require('../config/auth');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Register a new user (without JWT generation)
 */
const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json(errorResponse('Username already taken', 400));
    }
    
    // Create new user
    const user = await User.create({
      username,
      password,
      role: role || 'agent' // Default to agent role if no role is provided
    });
    
    // Respond with user details (without JWT)
    return res.status(201).json(successResponse({
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Login user (generate JWT on successful login)
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials', 401));
    }
    
    // Verify the provided password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Invalid credentials', 401));
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );
    
    // Respond with user details and JWT token
    return res.json(successResponse({
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token
    }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile (protected route)
 */
const getProfile = async (req, res, next) => {
  try {
    // User already available in req.user from auth middleware
    return res.json(successResponse({
      user: req.user
    }, 'Profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
