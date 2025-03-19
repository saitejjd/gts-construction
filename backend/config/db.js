const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection Function
const connectDB = async () => {
    try {
        // Connection URI from .env file
        const uri = process.env.MONGODB_URI;

        // Connection Options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        // Connect to MongoDB
        await mongoose.connect(uri, options);

        console.log('✅ MongoDB Connected Successfully');

        // Event Listeners for Connection
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from DB');
        });

        // Graceful Shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('Mongoose connection closed due to app termination');
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;