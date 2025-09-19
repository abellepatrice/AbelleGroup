const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  phone: { type: String,required: true},
  dob: { type: Date, required: true },
  profileImage:  { type: String },
  password: { type: String, required: true },
  role:     {type: String,enum: ['user', 'admin'],default: 'user'},
  createdAt: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} already exists.' });

module.exports = mongoose.model('User', userSchema);
