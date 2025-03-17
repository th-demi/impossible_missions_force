require('dotenv').config();
const User = require('../models/user');
const Gadget = require('../models/gadget');
const { sequelize } = require('../config/database');
const { generateCodename } = require('../utils/codeGenerator');

const initDatabase = async () => {
  try {
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Create default admin user
    const admin = await User.create({
      username: 'admin',
      password: 'IMF-admin-2025!',
      role: 'admin'
    });
    console.log('Admin user created:', admin.username);
    
    // Create default agent user
    const agent = await User.create({
      username: 'agent',
      password: 'IMF-agent-2025!',
      role: 'agent'
    });
    console.log('Agent user created:', agent.username);
    
    // Create sample gadgets
    const gadgets = [
      {
        name: 'Laser Watch',
        description: 'Watch with built-in high-powered laser',
        codename: generateCodename(),
        status: 'Available'
      },
      {
        name: 'Explosive Pen',
        description: 'Pen that doubles as a small explosive device',
        codename: generateCodename(),
        status: 'Deployed'
      },
      {
        name: 'Grappling Hook',
        description: 'Compact grappling hook for scaling buildings',
        codename: generateCodename(),
        status: 'Available'
      }
    ];
    
    for (const gadget of gadgets) {
      await Gadget.create(gadget);
    }
    console.log('Sample gadgets created');
    
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();