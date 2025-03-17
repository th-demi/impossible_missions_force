const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const gadgetRoutes = require('./routes/gadgets');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gadgets', gadgetRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the IMF Gadget API',
    status: 'Mission Active'
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database
const initDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Database synchronization failed:', error);
    process.exit(1);
  }
};

initDatabase();

module.exports = app;