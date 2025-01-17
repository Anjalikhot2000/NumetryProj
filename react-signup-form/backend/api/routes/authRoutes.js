const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// Example route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

module.exports = router;
