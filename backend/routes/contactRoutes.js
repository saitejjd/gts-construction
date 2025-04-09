const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST api/contact
// @desc    Create new contact message
router.post('/', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/api/contact', [
  check('email').isEmail().normalizeEmail(),
  check('name').notEmpty().trim().escape(),
  check('message').notEmpty().trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  // ... save to database
});


// Save contact form data to MongoDB
router.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ success: true, message: 'Contact saved!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error. Try again later.' });
  }
});
module.exports = router;