const express = require('express');
const { auth } = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const router = express.Router();

// Create challenge
router.post('/', auth, async (req, res) => {
  try {
    const challenge = new Challenge({ 
      ...req.body, 
      creatorId: req.user.id,
      participants: [req.user.id] 
    });
    await challenge.save();
    res.json(challenge);
  } catch (err) {
    console.error('Create challenge error:', err);
    res.status(500).json({ msg: 'Error creating challenge', error: err.message });
  }
});

// Join challenge
router.post('/:id/join', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge.participants.includes(req.user.id)) {
      challenge.participants.push(req.user.id);
      await challenge.save();
    }
    res.json(challenge);
  } catch (err) {
    console.error('Join challenge error:', err);
    res.status(500).json({ msg: 'Error joining challenge', error: err.message });
  }
});

// Get all challenges
router.get('/', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .populate('creatorId', 'username')
      .populate('participants', 'username');

    const Running = require('../models/Running');
    const Cycling = require('../models/Cycling');
    const StrengthWorkout = require('../models/StrengthWorkout');

    const challengesWithLeaderboard = await Promise.all(challenges.map(async (challenge) => {
      const c = challenge.toObject();
      
      const leaderboard = await Promise.all(c.participants.map(async (participant) => {
        const runnings = await Running.find({ userId: participant._id, date: { $gte: c.startDate, $lte: c.endDate } });
        const cyclings = await Cycling.find({ userId: participant._id, date: { $gte: c.startDate, $lte: c.endDate } });
        const strengths = await StrengthWorkout.find({ userId: participant._id, date: { $gte: c.startDate, $lte: c.endDate } });
        
        let totalCalories = 0;
        runnings.forEach(r => totalCalories += r.caloriesBurned);
        cyclings.forEach(cy => totalCalories += cy.caloriesBurned);
        strengths.forEach(s => totalCalories += s.caloriesBurned);
        
        return {
          userId: participant,
          totalCalories
        };
      }));
      
      c.leaderboard = leaderboard.sort((a, b) => b.totalCalories - a.totalCalories);
      return c;
    }));

    res.json(challengesWithLeaderboard);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching challenges' });
  }
});

module.exports = router;

