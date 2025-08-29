const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Repayment = require('../models/Repayment');
const authMiddleware = require('../middleware/auth'); // middleware to verify JWT

router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const { amount, durationMonths, purpose } = req.body;

    if (!amount || !durationMonths || !purpose) {
      return res.status(400).json({ message: 'Fill in all fields' });
    }
    // Extra validation
    if (amount > 7000) {
      return res.status(400).json({ error: 'Maximum loan amount is 7000' });
    }
    if (durationMonths > 3) {
      return res.status(400).json({ error: 'Maximum duration is 3 months' });
    }
    const loan = new Loan({
      userId: req.user.id,
      amount,
      durationMonths,
      purpose
    });

    await loan.save();
    res.status(201).json({ message: 'Loan application submitted', loan });
  } catch (error) {
    console.error('Loan application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-loans', authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ loans });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/repay/:loanId', authMiddleware, async (req, res) => {
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
      return res.status(400).json({ message: 'Loan is not approved for repayment' });
    }

    // Calculate total paid so far
    const repayments = await Repayment.find({ loanId: loan._id });
    const totalPaid = repayments.reduce((sum, r) => sum + r.amount, 0);
    const remaining = loan.amount - totalPaid;

    if (amount > remaining) {
      return res.status(400).json({ message: `Cannot pay more than remaining amount (${remaining})` });
    }

    // Save repayment
    const repayment = new Repayment({
      loanId: loan._id,
      userId: req.user.id,
      amount
    });
    await repayment.save();

    // Update loan status if fully paid
    if (totalPaid + amount >= loan.amount) {
      loan.status = 'paid';
      await loan.save();
    }

    res.status(200).json({ message: 'Repayment recorded', repayment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/balance/:loanId', authMiddleware, async (req, res) => {
  const loan = await Loan.findById(req.params.loanId);
  if (!loan) return res.status(404).json({ message: 'Loan not found' });

  // Option 1: Use loan.balance
  return res.status(200).json({ balance: loan.balance });

  // OR Option 2: Calculate from repayments
  // const repayments = await Repayment.find({ loanId: loan._id });
  // const totalPaid = repayments.reduce((sum, r) => sum + r.amountPaid, 0);
  // const balance = loan.amount - totalPaid;
  // return res.status(200).json({ balance });
});


module.exports = router;


// router.post('/repay/:loanId', authMiddleware, async (req, res) => {
//   const { amount } = req.body;
//   if (!amount || amount <= 0) {
//     return res.status(400).json({ message: 'Repayment amount is required and must be positive' });
//   }
//   try {
//     const loan = await Loan.findById(req.params.loanId);
//     if (!loan) return res.status(404).json({ message: 'Loan not found' });

//     if (loan.userId.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Unauthorized to repay this loan' });
//     }

//     if (loan.status !== 'approved') {
//       return res.status(400).json({ message: 'Only approved loans can be repaid' });
//     }

//     // Calculate total repaid so far
//     const totalRepaid = loan.repayments.reduce((sum, r) => sum + r.amount, 0);
//     const remaining = loan.amount - totalRepaid;

//     if (amount > remaining) {
//       return res.status(400).json({ message: `Repayment exceeds remaining amount (${remaining})` });
//     }

//     // Add repayment record
//     loan.repayments.push({ amount });

//     // Update status if fully repaid
//     if (totalRepaid + amount >= loan.amount) {
//       loan.status = 'paid';
//     }

//     await loan.save();

//     res.status(200).json({ message: 'Repayment successful', loan });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });