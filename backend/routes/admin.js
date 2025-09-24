const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const User = require('../models/User');
const Feedback = require('../models/Feedback')
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all loan applications
router.get('/loans', authMiddleware, isAdmin, async (req, res) => {
  try {
    const loans = await Loan.find().populate('userId', 'username email');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve or reject a loan
router.patch('/loans/:id', authMiddleware, isAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json({ message: `Loan ${status}`, loan });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/loan/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    loan.status = status;
    await loan.save();

    res.status(200).json({ message: 'Loan updated successfully', loan });
  } catch (error) {
    console.error('Admin loan update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/feedbacks', authMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json({ feedbacks });
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/feedbacks/:id', authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { rating, feedback: feedbackText } = req.body;
    if (rating !== undefined) feedback.rating = rating;
    if (feedbackText !== undefined) feedback.feedback = feedbackText;

    const updated = await feedback.save();
    res.json(updated);
  } catch (err) {
    console.error("Error updating feedback:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/feedbacks/:id', authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;


