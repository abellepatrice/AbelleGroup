const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const newFeedback = new Feedback({
      userId: req.user.id,
      rating,
      feedback,
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/my", authenticateToken, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching user feedbacks:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
