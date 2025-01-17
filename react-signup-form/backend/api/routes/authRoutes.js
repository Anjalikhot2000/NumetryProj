const express = require('express');
const User = require('../../models/user'); // Adjust the path if necessary
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully', newUser });
  } catch (err) {
    console.error('Error during sign-up:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Logged in successfully', user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
