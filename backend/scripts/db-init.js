const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
require('dotenv').config();

// Database connection
const uri = 'mongodb+srv://saitejj2023:<db_password>@constructioncluster.yve0q.mongodb.net/?retryWrites=true&w=majority&appName=ConstructionCluster'; // Replace with your actual MongoDB URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    // Your database initialization code here
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Function to initialize the database
const initializeDB = async () => {
    try {
        // Clear existing data (optional)
        await User.deleteMany({});
        await Project.deleteMany({});

        // Create an admin user
        const adminUser = new User({
            username: 'admin',
            password: 'Password123', // Use a secure password in production
            role: 'admin',
        });
        await adminUser.save();
        console.log('✅ Admin user created:', adminUser.username);

        // Create sample projects
        const sampleProjects = [
            {
                name: 'Lekki Luxury Apartments',
                location: 'Lekki, Lagos',
                completionDate: new Date('2022-03-15'),
                image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
            },
            {
                name: 'Victoria Island Office Tower',
                location: 'Victoria Island, Lagos',
                completionDate: new Date('2023-01-20'),
                image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
            },
            {
                name: 'Abuja Civic Center',
                location: 'Abuja',
                completionDate: new Date('2021-11-10'),
                image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
            },
        ];

        await Project.insertMany(sampleProjects);
        console.log('✅ Sample projects added:', sampleProjects.length);

        console.log('🎉 Database initialization complete!');
        process.exit(0); // Exit successfully
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1); // Exit with error
    }
};

// Run the initialization
initializeDB();