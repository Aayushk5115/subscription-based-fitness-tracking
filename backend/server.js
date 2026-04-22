const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
// Allow requests from frontend domain (either localhost or deployed frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true,
}));
app.use(express.json());

// MongoDB connection caching for serverless environments
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    // Mongoose buffers operations, so this is safe to call
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Initialize DB connection
connectDB();

// Basic route / Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fitness App Backend is successfully running!',
    status: 'Healthy',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/admin', require('./routes/admin'));

// Only listen on a port if we're not running in a Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

// Export the Express API for Vercel
module.exports = app;

