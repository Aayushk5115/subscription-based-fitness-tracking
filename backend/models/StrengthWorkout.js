const mongoose = require('mongoose');
const Activity = require('./Activity');

class StrengthWorkout extends Activity {
  constructor(duration, caloriesBurned, date, exercises) {
    super(duration, caloriesBurned, date);
    this.exercises = exercises; // array of {name, sets, reps}
  }

  getDescription() {
    return `Strength: ${this.exercises.length} exercises`;
  }
}

const strengthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number
  }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StrengthWorkout', strengthSchema);

