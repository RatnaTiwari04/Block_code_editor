const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  title: String,
  code: String,
  language: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Project', projectSchema);
