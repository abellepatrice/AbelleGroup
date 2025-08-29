const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/keys');

// ======================
// Multer Setup
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder where files are saved
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ======================
// Signup Route with Image Upload
// ======================
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

// ======================
// Simple Signup 2 (No Image)
// ======================
router.post('/signup-2', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ======================
// Login Route
// ======================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const User = require('../models/User');
// const authMiddleware = require('../middleware/auth'); // must verify ACCESS_SECRET

// const router = express.Router();

// /* ===========================
//    ENV + CONSTANTS
// =========================== */
// const ACCESS_SECRET = process.env.ACCESS_SECRET || 'dev_access_secret_change_me';
// const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev_refresh_secret_change_me';
// const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';     // access token lifetime
// const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '7d'; // refresh token lifetime
// const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');

// // Ensure upload dir exists
// if (!fs.existsSync(UPLOAD_DIR)) {
//   fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// }

// /* ===========================
//    Multer (profile images)
// =========================== */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });

// /* ===========================
//    Helpers
// =========================== */
// function signAccessToken(payload) {
//   return jwt.sign(payload, ACCESS_SECRET, { expiresIn: JWT_EXPIRES });
// }

// function signRefreshToken(payload) {
//   return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
// }

// function publicUser(u) {
//   return {
//     id: u._id,
//     username: u.username,
//     email: u.email,
//     phone: u.phone || null,
//     dob: u.dob || null,
//     profileImage: u.profileImage || null,
//     role: u.role || 'user',
//   };
// }

// /* ===========================
//    SIGNUP (with image)
//    POST /api/auth/signup
// =========================== */
// router.post('/signup', upload.single('profileImage'), async (req, res) => {
//   try {
//     const { username, email, phone, dob, password } = req.body;

//     if (!username || !email || !phone || !dob || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'Email already in use' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null;

//     const user = new User({
//       username,
//       email,
//       phone,
//       dob,
//       password: hashedPassword,
//       profileImage: profileImagePath,
//     });

//     await user.save();

//     // Issue tokens
//     const payload = { userId: user._id };
//     const accessToken = signAccessToken(payload);
//     const refreshToken = signRefreshToken(payload);

//     // store refresh token (so you can revoke)
//     user.refreshToken = refreshToken;
//     await user.save();

//     return res.status(201).json({
//       message: 'User created successfully',
//       accessToken,
//       refreshToken,
//       user: publicUser(user),
//     });
//   } catch (err) {
//     console.error('Signup error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ===========================
//    SIGNUP (simple)
//    POST /api/auth/signup-2
// =========================== */
// router.post('/signup-2', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: 'Please fill all fields' });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(409).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ username, email, password: hashedPassword });
//     await user.save();

//     return res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     console.error('Signup-2 error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ===========================
//    LOGIN
//    POST /api/auth/login
// =========================== */
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: 'Please fill all fields' });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: 'Invalid credentials' });

//     const payload = { userId: user._id };

//     const accessToken = signAccessToken(payload);   // short-lived
//     const refreshToken = signRefreshToken(payload); // long-lived

//     // persist refresh token (enables revocation)
//     user.refreshToken = refreshToken;
//     await user.save();

//     return res.json({
//       message: 'Login successful',
//       accessToken,
//       refreshToken,
//       user: publicUser(user),
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ===========================
//    REFRESH TOKEN
//    POST /api/auth/refresh
// =========================== */
// router.post('/refresh', async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.sendStatus(401);

//     // Must exist in DB if you store it (revocation support)
//     const user = await User.findOne({ refreshToken });
//     if (!user) return res.sendStatus(403);

//     jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
//       if (err) return res.sendStatus(403);

//       const payload = { userId: decoded.userId };

//       // Rotate refresh token (recommended)
//       const newAccessToken = signAccessToken(payload);
//       const newRefreshToken = signRefreshToken(payload);

//       user.refreshToken = newRefreshToken;
//       await user.save();

//       return res.json({
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken, // return new RT so client updates it
//       });
//     });
//   } catch (err) {
//     console.error('Refresh error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ===========================
//    LOGOUT (invalidate refresh)
//    POST /api/auth/logout
// =========================== */
// router.post('/logout', async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

//     const user = await User.findOne({ refreshToken });
//     if (user) {
//       user.refreshToken = null;
//       await user.save();
//     }
//     return res.json({ message: 'Logged out' });
//   } catch (err) {
//     console.error('Logout error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ===========================
//    GET PROFILE (for Android)
//    GET /api/auth/user/profile
// =========================== */
// router.get('/user/profile', authMiddleware, async (req, res) => {
//   try {
//     // authMiddleware should set req.user = { userId: ... }
//     const userId = req.user.userId;
//     const user = await User.findById(userId);
//     if (!user) return res.sendStatus(404);

//     return res.json(publicUser(user));
//   } catch (err) {
//     console.error('Get profile error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ===========================
//    UPDATE PROFILE
//    PUT /api/auth/profile
// =========================== */
// router.put('/profile', authMiddleware, upload.single('profileImage'), async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { username, email, phone, dob } = req.body;

//     const updateData = {};
//     if (username !== undefined) updateData.username = username;
//     if (email !== undefined) updateData.email = email;
//     if (phone !== undefined) updateData.phone = phone;
//     if (dob !== undefined) updateData.dob = dob;

//     if (req.file) {
//       updateData.profileImage = `/uploads/${req.file.filename}`;
//     }

//     const updated = await User.findByIdAndUpdate(userId, updateData, { new: true });
//     if (!updated) return res.status(404).json({ message: 'User not found' });

//     return res.json({
//       message: 'Profile updated successfully',
//       user: publicUser(updated),
//     });
//   } catch (err) {
//     console.error('Profile update error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const User = require('../models/User');
// const authMiddleware = require('../middleware/auth');

// const router = express.Router();

// // JWT secret (make sure you store in environment variable in production)
// const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

// // ===== Multer setup for profile images =====
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../uploads/'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// // ===== SIGNUP =====
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


// router.post('/signup-2', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Validation
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: 'Please fill all fields' });
//     }

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });

//   } catch (err) {
//     console.error('Signup error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ===== LOGIN =====
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validation
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Please fill all fields' });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     // Create JWT token
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         username: user.username,
//         email: user.email,
//         profileImage: user.profileImage || null
//       }
//     });

//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ===== UPDATE PROFILE =====
// router.put('/profile', authMiddleware, upload.single('profileImage'), async (req, res) => {
//   try {
//     const { username, email } = req.body;
//     const userId = req.user.userId;

//     const updateData = { username, email };

//     if (req.file) {
//       updateData.profileImage = `/uploads/${req.file.filename}`;
//     }

//     const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

//     if (!updatedUser) return res.status(404).json({ message: 'User not found' });

//     res.json({
//       message: 'Profile updated successfully',
//       user: updatedUser
//     });

//   } catch (err) {
//     console.error('Profile update error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

