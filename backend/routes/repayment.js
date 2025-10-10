
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Loan = require('../models/Loan');
const Repayment = require('../models/Repayment');

// @route   POST /api/repayment/:loanId
// @desc    Repay a loan
router.post('/:loanId', authMiddleware, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Repayment amount must be positive' });
  }

  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (loan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (loan.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved loans can be repaid' });
    }

    // Calculate total repaid so far
    const repayments = await Repayment.find({ loanId: loan._id });
    const totalPaid = repayments.reduce((sum, r) => sum + r.amountPaid, 0);
    const remaining = loan.amount - totalPaid;

    if (amount > remaining) {
      return res.status(400).json({ message: `Repayment exceeds remaining amount (${remaining})` });
    }

    // Create repayment record
    const newRepayment = new Repayment({
      loanId: loan._id,
      userId: req.user.id,
      amountPaid: amount
    });
    await newRepayment.save();

    // Mark loan as fully paid if applicable
    if (totalPaid + amount >= loan.amount) {
      loan.status = 'paid';
      await loan.save();
    }

    res.status(200).json({ message: 'Repayment successful', repayment: newRepayment });
  } catch (err) {
    console.error('Repayment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/balance/:loanId', authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (loan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const repayments = await Repayment.find({ loanId: loan._id });
    const totalPaid = repayments.reduce((sum, r) => sum + r.amountPaid, 0);
    const remainingBalance = loan.amount - totalPaid;

    res.status(200).json({ 
      loanId: loan._id,
      originalAmount: loan.amount,
      totalPaid,
      remainingBalance
    });
  } catch (err) {
    console.error('Balance check error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/repay/:loanId', authMiddleware, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Repayment amount is required and must be positive' });
  }

  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (loan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const repayment = new Repayment({
      loanId: loan._id,
      amount
    });

    await repayment.save();

    res.status(201).json({ message: 'Repayment successful', repayment });
  } catch (err) {
    console.error('Repayment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;