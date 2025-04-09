const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  image: String,
  completionDate: Date
});

module.exports = mongoose.model('Project', projectSchema);