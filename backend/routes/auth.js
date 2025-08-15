const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// JWT secret (make sure you store in environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

// ===== Multer setup for profile images =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// ===== SIGNUP =====
router.post('/signup', upload.single('profileImage'), async (req, res) => {
  const { username, email, phone, dob, password } = req.body;

  if (!username || !email || !phone || !dob || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newUser = new User({
      username,
      email,
      phone,
      dob,
      profileImage: profileImagePath,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      role: newUser.role,
      message: 'User created successfully'
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/signup-2', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage || null
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== UPDATE PROFILE =====
router.put('/profile', authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.userId;

    const updateData = { username, email };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const path = require('path');
// const multer = require('multer');
// const User = require('../models/User');
// const { JWT_SECRET } = require('../config/keys');

// // ======================
// // Multer Setup
// // ======================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // folder where files are saved
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// // ======================
// // Signup Route with Image Upload
// // ======================
// router.post('/signup', upload.single('profileImage'), async (req, res) => {
//   const { username, email, phone, dob, password } = req.body;

//   if (!username || !email || !phone || !dob || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null;

//     const newUser = new User({
//       username,
//       email,
//       phone,
//       dob,
//       profileImage: profileImagePath,
//       password: hashedPassword
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       { id: newUser._id, email: newUser.email, role: newUser.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({
//       token,
//       role: newUser.role,
//       message: 'User created successfully'
//     });
//   } catch (err) {
//     console.error('Signup error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ======================
// // Simple Signup 2 (No Image)
// // ======================
// router.post('/signup-2', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const exists = await User.findOne({ username });
//     if (exists) return res.status(400).json({ message: 'User already exists' });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = new User({ username, email, password: hashed });
//     await user.save();

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ======================
// // Login Route
// // ======================
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({
//       $or: [{ username }, { email: username }]
//     });

//     if (!user) return res.status(400).json({ error: 'Invalid username or password' });

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) return res.status(400).json({ error: 'Invalid username or password' });

//     const token = jwt.sign(
//       { id: user._id, username: user.username, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // // Google OAuth routes
// // router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
// //   const token = jwt.sign({ username: req.user.id }, JWT_SECRET, { expiresIn: '1h' });
// //   res.json({ token });
// // });

// // // Facebook OAuth routes
// // router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// // router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
// //   const token = jwt.sign({ username: req.user.id }, JWT_SECRET, { expiresIn: '1h' });
// //   res.json({ token });
// // });

// module.exports = router;
