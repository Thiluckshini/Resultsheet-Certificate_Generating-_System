// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { Student } = require('../models'); // Sequelize model for Student

// GET /api/student/me
// GET /api/student/me
router.get('/me', (req, res) => {
  const student = req.session?.student; // session-based login required
  if (!student) return res.status(401).json({ error: 'Unauthorized' });
  res.json(student);
});

router.get('/students', async (req, res) => {
  const { institute_id, department_id } = req.query;

  try {
    const query = `
      SELECT * FROM students 
      WHERE institute_id = ? AND department_id = ?
    `;
    const [rows] = await db.execute(query, [institute_id, department_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});


// Create a new student
router.post('/', async (req, res) => {
  console.log('POST /api/students with body:', req.body);
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ message: 'Student created successfully.', student });
  } catch (err) {
    console.error('Error creating student:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET students filtered by institute and department via query params
router.get('/by-institute-department', async (req, res) => {
  const { institute, department } = req.query;

  if (!institute || !department) {
    return res.status(400).json({ error: 'Institute and department are required.' });
  }

  try {
    const students = await Student.findAll({
      where: {
        institute: decodeURIComponent(institute),
        department: decodeURIComponent(department),
      },
    });
    res.json(students);
  } catch (err) {
    console.error('Error fetching students by institute and department:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all students (no filters)
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET students by institute (URL param)
router.get('/by-institute/:institute', async (req, res) => {
  try {
    const instituteName = decodeURIComponent(req.params.institute);
    console.log('GET /api/students/by-institute called with:', instituteName);

    const students = await Student.findAll({
      where: { institute: instituteName },
    });

    console.log('Students found:', students.length);
    res.json(students);
  } catch (err) {
    console.error('Error in GET /by-institute:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET students by institute (required), and optionally filter by department
const slugify = (text) => 
  text.toLowerCase().trim().replace(/\s+/g, '-');

router.get('/by-institute', async (req, res) => {
  if (!req.query.institute) return res.status(400).json({ error: 'Institute required.' });

  // decode once
  const instituteRaw = decodeURIComponent(req.query.institute);
  // slugify for matching DB
  const instituteSlug = slugify(instituteRaw);

  try {
    const students = await Student.findAll({ where: { institute: instituteSlug } });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/students/:studentId - get single student by student_id
router.get('/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findOne({ where: { student_id: studentId } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update a student by id
router.put('/:id', async (req, res) => {
  console.log('PUT /api/students/:id called with id:', req.params.id, 'body:', req.body);
  try {
    const [updated] = await Student.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedStudent = await Student.findByPk(req.params.id);
      res.json({ message: 'Student updated.', student: updatedStudent });
    } else {
      res.status(404).json({ error: 'Student not found.' });
    }
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a student by id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Student.destroy({ where: { id: req.params.id } });

    if (deleted) {
      res.json({ message: 'Student deleted.' });
    } else {
      res.status(404).json({ error: 'Student not found.' });
    }
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
