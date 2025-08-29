const mongoose = require('mongoose');
const User = require('./User');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, max : [7000, "Maximum Loan amount is 7000"]},
  interestRate: { type: Number, default: 10 }, 
  durationMonths: { type: Number, required: true, max : [3, "Maximum loan repayment duration is 3 months"]},
  purpose: {type: String, required: true},
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//   repayments: [
//     {
//       amount: Number,
//       date: { type: Date, default: Date.now }
//     }
//   ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Loan', loanSchema);
