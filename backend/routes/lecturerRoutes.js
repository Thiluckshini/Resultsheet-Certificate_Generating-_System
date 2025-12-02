// backend/routes/lecturerRoutes.js

const express = require('express');
const router = express.Router();
const { Lecturer } = require('../models');

// Create a new lecturer
router.post('/', async (req, res) => {
  try {
    const lecturer = await Lecturer.create(req.body);
    res.status(201).json({ message: 'Lecturer created successfully.', lecturer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET lecturers by institute_id (passed as query)
router.get('/', async (req, res) => {
  const { institute_id } = req.query;
  try {
    const whereClause = institute_id ? { institute: institute_id } : {};
    const lecturers = await Lecturer.findAll({ where: whereClause });
    console.log('GET /api/lecturers, result count:', lecturers.length);
    res.json(lecturers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/by-institute/:institute', async (req, res) => {
  try {
    const instituteName = decodeURIComponent(req.params.institute);
    const lecturers = await Lecturer.findAll({ where: { institute: instituteName } });
    res.json(lecturers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Update a lecturer
router.put('/:id', async (req, res) => {
  console.log('PUT /api/lecturers/:id called with id:', req.params.id, 'body:', req.body);
  try {
    const [updated] = await Lecturer.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedLecturer = await Lecturer.findByPk(req.params.id);
      res.json({ message: 'Lecturer updated.', lecturer: updatedLecturer });
    } else {
      res.status(404).json({ error: 'Lecturer not found.' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a lecturer
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Lecturer.destroy({ where: { id: req.params.id } });

    if (deleted) {
      res.json({ message: 'Lecturer deleted.' });
    } else {
      res.status(404).json({ error: 'Lecturer not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
