require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authMiddleware = require('./backend/middleware/authMiddleware');
const errorHandler = require('./backend/middleware/errorHandler');
const authRoutes = require('./backend/routes/authRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Mongoose Models
const Contact = require('./backend/models/Contact');
const Project = require('./backend/models/Project');

// API Routes

// 1. Contact Form Submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Save to database
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// 2. Get All Projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort('-createdAt');
        res.json({ success: true, data: projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Failed to load projects.' });
    }
});

// 3. Add New Project (Admin Only)
app.post('/api/projects', authMiddleware, async (req, res) => {
    try {
        const { name, location, completionDate, image } = req.body;

        // Validate input
        if (!name || !location || !completionDate || !image) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Save to database
        const newProject = new Project({ name, location, completionDate, image });
        await newProject.save();

        res.status(201).json({ success: true, message: 'Project added successfully!' });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ success: false, message: 'Failed to add project.' });
    }
});

// 4. Get All Messages (Admin Only)
app.get('/api/contact', async (req, res) => {
    try {
        const messages = await Contact.find().sort('-date');
        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Failed to load messages.' });
    }
});

// Serve Admin Dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Catch-all route for frontend routing (React/Vue/Angular compatibility)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Use error handler (must be after all routes)
app.use(errorHandler);

// Example of a protected route
app.get('/api/admin/protected', authMiddleware, (req, res) => {
    res.json({ success: true, message: 'This is a protected route' });
});

// Use auth routes
app.use('/api/auth', authRoutes);