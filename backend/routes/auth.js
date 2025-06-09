const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = require('../config/keys');
const User = require('../models/User');

// Simple in-memory users DB for demo (replace with real DB!)
const users = [];


router.post('/signup', async (req, res) => {
  const { username,email, password } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username,email, password: hashed });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Try to find user by username OR email
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });

    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Invalid username or password' });

const token = jwt.sign(
  { id: user._id, username: user.username, role: user.role },JWT_SECRET,{ expiresIn: '1h' });
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ username: req.user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ username: req.user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// router.post('/register', async (req, res) => {
//   const { username,email, password } = req.body;
//   if (users.find(u => u.username === username || u.email === email)) {
//     return res.status(400).json({ error: 'User already exists' });
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   users.push({ username,email, password: hashedPassword });
//   res.json({ message: 'User registered' });
// });


module.exports = router;
