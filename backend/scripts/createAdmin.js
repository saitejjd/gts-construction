const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        const admin = new User({
            username: 'admin',
            password: 'admin123', // Change this to a strong password
            role: 'admin',
        });

        await admin.save();
        console.log('✅ Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();