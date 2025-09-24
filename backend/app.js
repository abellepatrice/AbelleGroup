const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

// Passport config
require('./config/passport'); 

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const loanRoutes = require('./routes/loan');
const adminRoutes = require('./routes/admin');
const repaymentRoutes = require('./routes/repayment');
const uploadRoutes = require('./routes/upload');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Middleware
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(bodyParser.json());
app.use(passport.initialize());

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/repayment', repaymentRoutes);
app.use('/api/upload', uploadRoutes); 
app.use("/api/feedback", feedbackRoutes);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.send('Loan App Backend is running');
});

module.exports = app;
