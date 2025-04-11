require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize app
const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['POST', 'GET']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});