const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, welcome to your dashboard.` });
});


module.exports = router;
