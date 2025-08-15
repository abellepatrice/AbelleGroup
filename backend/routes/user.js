const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');
const upload = require('./upload');

router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, welcome to your dashboard.` });
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});
// router.put('/profile', upload.single('profileImage'), async (req, res) => {
//   const { username, email } = req.body;
//   const profileImagePath = req.file ? req.file.path : null;

//   const updatedUser = await User.findByIdAndUpdate(req.user.id, {
//     username,
//     email,
//     ...(profileImagePath && { profileImage: profileImagePath })
//   }, { new: true });

//   res.json({ message: 'Profile updated', user: updatedUser });
// });

module.exports = router;
