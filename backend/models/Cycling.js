const mongoose = require('mongoose');
const Activity = require('./Activity');

class Cycling extends Activity {
  constructor(duration, caloriesBurned, date, distance) {
    super(duration, caloriesBurned, date);
    this.distance = distance; // km
  }

  getDescription() {
    return `Cycling ${this.distance}km`;
  }
}

const cyclingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  distance: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Cycling', cyclingSchema);

