// Abstract base class for Activity (OOSE Abstraction/Encapsulation)
class Activity {
  constructor(duration, caloriesBurned, date) {
    if (this.constructor === Activity) {
      throw new Error('Abstract class Activity cannot be instantiated directly');
    }
    this.duration = duration; // minutes
    this.caloriesBurned = caloriesBurned;
    this.date = date || new Date();
  }

  // Abstract method
  getDescription() {
    throw new Error('Must implement getDescription() in child class');
  }

  // Common method
  getSummary() {
    return `${this.getDescription()} - ${this.duration}min, ${this.caloriesBurned} cal`;
  }
}

module.exports = Activity;

