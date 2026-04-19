const mongoose = require('mongoose');
const Activity = require('./Activity');

class Running extends Activity {
  constructor(duration, caloriesBurned, date, distance) {
    super(duration, caloriesBurned, date);
    this.distance = distance; // km
  }

  getDescription() {
    return `Running ${this.distance}km`;
  }
}

const runningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true }, // minutes
  caloriesBurned: { type: Number, required: true },
  distance: { type: Number, required: true }, // km
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Running', runningSchema);

