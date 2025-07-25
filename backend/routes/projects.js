const express = require('express');
const Project = require('../models/projects');
const auth = require('../middleware/auth');
const router = express.Router();

// Save new project
router.post('/', auth, async (req, res) => {
  const { title, code, language } = req.body;
  try {
    const project = await Project.create({
      title,
      code,
      language,
      user: req.user._id   // comes from auth middleware
    });
    res.json({ message: 'Project saved', project });
  } catch (e) {
    console.error('Save project error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's projects
router.get('/my', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (e) {
    console.error('Fetch projects error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
