const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: 'https://numetry-proj-nwoy.vercel.app', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Example response (replace with your database logic)
  return res.status(201).json({ message: 'User signed up successfully!' });
});

// Login endpoint (if needed)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Example response (replace with your database logic)
  return res.status(200).json({ message: 'Login successful!' });
});

// Fallback route for invalid endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
