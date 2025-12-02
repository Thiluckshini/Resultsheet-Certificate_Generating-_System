// backend/routes/subjectRoutes.js

const express = require('express');
const router = express.Router();
const { Subject } = require('../models');

const db = require('../config/db'); // or wherever your DB config is


// GET /api/subjects
router.get('/', async (req, res) => {
  try {
    const { institute, department } = req.query;

    if (!institute || !department) {
      return res.status(400).json({ error: 'Institute and department are required query parameters' });
    }

    const slugToName = (slug) =>
      slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    const instituteName = slugToName(institute);
    const departmentName = slugToName(department);
    
    const subjects = await Subject.findAll({
      where: {
        institute: instituteName,
        department: departmentName,
      },
      order: [['name', 'ASC']],
    });
    

    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Get all subjects for a specific institute
// routes/subjects.js
router.get('/by-institute/:institute', async (req, res) => {
  const { institute } = req.params;
  try {
    const subjects = await Subject.findAll({ where: { institute } });
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});



// Add a new subject
router.post('/', async (req, res) => {
    const { name, code, credits, institute, department, course, semester } = req.body;
  
    if (!name || !code || !credits || !institute || !department || !course || !semester) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
  
    try {
      const newSubject = await Subject.create({
        name,
        code,
        credits,
        institute,
        department,
        course,
        semester,
      });
      res.status(201).json(newSubject);
    } catch (error) {
      console.error('Error creating subject:', error);
      res.status(500).json({ error: 'Failed to create subject' });
    }
  });
  
// Update a subject by id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, credits, institute, department, course, semester } = req.body;
  
    try {
      const subject = await Subject.findByPk(id);
      if (!subject) return res.status(404).json({ error: 'Subject not found' });
  
      await subject.update({
        name,
        code,
        credits,
        institute,
        department,
        course,
        semester,
      });
  
      res.json(subject);
    } catch (error) {
      console.error('Error updating subject:', error);
      res.status(500).json({ error: 'Failed to update subject' });
    }
  });
  
// Delete a subject by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByPk(id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    await subject.destroy();
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

// Get all subjects (no filter)
router.get('/all', async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      order: [['institute', 'ASC'], ['department', 'ASC'], ['semester', 'ASC'], ['name', 'ASC']],
    });
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching all subjects:', err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

module.exports = router;
