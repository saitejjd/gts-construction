require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Contact = require('./backend/models/Contact');

// Initialize app
const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.CLIENT_URL, // Use CLIENT_URL from .env
  methods: ['POST', 'GET']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));


// POST route for contact form
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the incoming request

    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      console.error('Validation failed: Missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to MongoDB
    console.log('Saving to MongoDB...');
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    console.log('Contact saved:', newContact); // Log the saved document

    res.status(201).json({ message: 'Message received!' });
  } catch (error) {
    console.error('Error saving contact:', error); // Log the error
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Serve frontend
app.get('/api/contact', (req, res) => {
  res.send('Contact API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});