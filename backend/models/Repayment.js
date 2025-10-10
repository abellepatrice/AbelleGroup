const mongoose = require("mongoose");

const repaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
    transactionId: { type: String, unique: true },
    amountPaid: Number,
    phone: String,
    date: String,
    reference: String,
    balanceRemaining: Number,
    raw: Object 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Repayment", repaymentSchema);
