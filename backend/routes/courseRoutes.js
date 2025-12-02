// backend/routes/courseRoutes.js

const express = require('express');
const router = express.Router();
const { Course } = require('../models');

// Add this at the top of courseRoutes.js
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching all courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get all courses for a specific institute
// Helper function to convert slug to name (e.g. edu-lanka-institute -> Edu Lanka Institute)
const slugToName = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

router.get('/by-institute/:institute', async (req, res) => {
  const { institute } = req.params;
  const readableName = slugToName(institute); // e.g. 'edu-lanka-institute' => 'Edu Lanka Institute'

  console.log('Fetching courses for institute:', readableName);

  try {
    const courses = await Course.findAll({
      where: { institute: readableName },
      order: [['name', 'ASC']],
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/courses', async (req, res) => {
  const { institute_id, department_id } = req.query;

  try {
    const query = `
      SELECT * FROM courses 
      WHERE institute_id = ? AND department_id = ?
    `;
    const [rows] = await db.execute(query, [institute_id, department_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});


// Add a new course
router.post('/', async (req, res) => {
  const { name, course_code, description, institute, department, duration } = req.body;
  if (!name || !course_code || !institute || !department || !duration) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const newCourse = await Course.create({
      name,
      course_code,
      description,
      institute,
      department,
      duration,
    });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course by id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, course_code, description, institute, department, duration } = req.body;

  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await course.update({
      name,
      course_code,
      description,
      institute,
      department,
      duration,
    });

    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
