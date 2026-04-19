const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['free', 'premium'], default: 'free' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  paymentId: String // simulated
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);

