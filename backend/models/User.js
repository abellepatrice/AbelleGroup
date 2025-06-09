const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     {type: String,enum: ['user', 'admin'],default: 'user'},
  createdAt: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator, { message: 'Email already exists.' });

module.exports = mongoose.model('User', userSchema);
