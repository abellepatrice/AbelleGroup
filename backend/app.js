const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

require('./config/passport'); // Load passport strategies

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const loanRoutes = require('./routes/loan')
const adminRoutes = require('./routes/admin');
const repaymentRoutes = require('./routes/repayment');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());


app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/loan', loanRoutes)
app.use('/api/repayment', repaymentRoutes)

app.get('/', (req, res) => {
  res.send('Loan App Backend is running');
});

module.exports = app;
