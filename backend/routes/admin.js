const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get all users (admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Update user subscription (admin)
router.put('/users/:id/subscription', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { subscription: req.body.subscription },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Update failed' });
  }
});

module.exports = router;

