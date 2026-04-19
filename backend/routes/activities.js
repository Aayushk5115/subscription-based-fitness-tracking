const express = require('express');
const { auth } = require('../middleware/auth');
const Running = require('../models/Running');
const Cycling = require('../models/Cycling');
const StrengthWorkout = require('../models/StrengthWorkout');
const router = express.Router();

// Add running
router.post('/running', auth, async (req, res) => {
  try {
    const activity = new Running({ ...req.body, userId: req.user.id });
    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error('Add running error:', err);
    res.status(500).json({ msg: 'Error adding activity', error: err.message });
  }
});

// Add cycling
router.post('/cycling', auth, async (req, res) => {
  try {
    const activity = new Cycling({ ...req.body, userId: req.user.id });
    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error('Add cycling error:', err);
    res.status(500).json({ msg: 'Error adding activity', error: err.message });
  }
});

// Add strength
router.post('/strength', auth, async (req, res) => {
  try {
    const activity = new StrengthWorkout({ ...req.body, userId: req.user.id });
    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error('Add strength error:', err);
    res.status(500).json({ msg: 'Error adding activity', error: err.message });
  }
});

// Delete running
router.delete('/running/:id', auth, async (req, res) => {
  try {
    const result = await Running.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ msg: 'Activity not found' });
    res.json({ msg: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting activity' });
  }
});

// Delete cycling
router.delete('/cycling/:id', auth, async (req, res) => {
  try {
    const result = await Cycling.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ msg: 'Activity not found' });
    res.json({ msg: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting activity' });
  }
});

// Delete strength
router.delete('/strength/:id', auth, async (req, res) => {
  try {
    const result = await StrengthWorkout.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ msg: 'Activity not found' });
    res.json({ msg: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting activity' });
  }
});

// Get user activities
router.get('/', auth, async (req, res) => {
  try {
    const [runnings, cyclings, strengths] = await Promise.all([
      Running.find({ userId: req.user.id }).sort({ date: -1 }),
      Cycling.find({ userId: req.user.id }).sort({ date: -1 }),
      StrengthWorkout.find({ userId: req.user.id }).sort({ date: -1 })
    ]);
    res.json({ runnings, cyclings, strengths });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching activities' });
  }
});

module.exports = router;

