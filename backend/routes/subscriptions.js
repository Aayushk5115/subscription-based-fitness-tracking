const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const router = express.Router();

// Upgrade to premium (simulate payment)
router.post('/upgrade', auth, async (req, res) => {
  try {
    if (req.user.subscription === 'premium') {
      return res.status(400).json({ msg: 'Already premium' });
    }

    // Simulate payment
    const paymentId = 'pay_' + Date.now();
    
    // Update user
    await User.findByIdAndUpdate(req.user.id, { subscription: 'premium' });

    // Create subscription record
    const subscription = new Subscription({
      userId: req.user.id,
      type: 'premium',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      paymentId
    });
    await subscription.save();

    res.json({ msg: 'Upgraded to premium', paymentId });
  } catch (err) {
    res.status(500).json({ msg: 'Upgrade failed' });
  }
});

// Get subscription status
router.get('/', auth, async (req, res) => {
  const subscription = await Subscription.findOne({ userId: req.user.id })
    .sort({ startDate: -1 });
  res.json(subscription || { type: 'free' });
});

module.exports = router;

