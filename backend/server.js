require('dotenv').config();  // Load environment variables
const express = require('express'); // Express framework
const cors = require('cors'); // CORS middleware
const app = require('./src/app'); // Import your app (e.g., routes)

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',  // Allow all origins
  methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
  credentials: true,  // Allow sending cookies and credentials if needed
};

app.use(cors(corsOptions));

// Start the server
app.listen(PORT, () => {
  console.log(`IMF Gadget API server running on port ${PORT}`);
  console.log('This message will self-destruct in 5 seconds...');
});
