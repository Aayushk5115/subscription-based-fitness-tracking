const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const Running = require('./models/Running');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.findOneAndUpdate(
      { email: 'admin@fitnessapp.com' },
      { 
        username: 'Admin', 
        email: 'admin@fitnessapp.com', 
        password: hashedPassword, 
        isAdmin: true 
      },
      { upsert: true, new: true }
    );

    // Create sample users
    const sampleUsers = [
      { username: 'JohnFit', email: 'john@example.com', password: await bcrypt.hash('password123', 12), age: 28, weight: 75, goals: 'Lose weight' },
      { username: 'JaneRunner', email: 'jane@example.com', password: await bcrypt.hash('password123', 12), age: 32, weight: 62, goals: 'Marathon prep' }
    ];

    for (let userData of sampleUsers) {
      const user = await User.findOneAndUpdate(
        { email: userData.email },
        userData,
        { upsert: true, new: true }
      );
      
      // Add sample activities
      await Running.create({
        userId: user._id,
        duration: 45,
        distance: 8.5,
        caloriesBurned: 650
      });
    }

    console.log('Seed complete! Admin: admin@fitnessapp.com / admin123');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

