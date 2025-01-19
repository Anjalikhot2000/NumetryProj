const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Assuming you're using MongoDB
require('dotenv').config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin: 'https://numetry-proj-nwoy.vercel.app', // Your frontend Vercel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes
const authRoutes = require('./api/routes/authRoutes');
app.use('/api', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
