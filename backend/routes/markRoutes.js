// backend/routes/markRoutes

const router = require('express').Router();
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
 
router.post('/bulk', async (req, res) => {
  const marksData = req.body;

  if (!Array.isArray(marksData)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  try {
    for (const { studentId, subjectId, marks } of marksData) {
      await sequelize.query(
        `INSERT INTO marks (student_id, subject_id, marks)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE marks = VALUES(marks)`,
        {
          replacements: [studentId, subjectId, marks],
          type: QueryTypes.INSERT,
        }
      );
    }

    res.status(200).json({ message: 'Marks saved successfully' });
  } catch (error) {
    console.error('Failed to save marks:', error);
    res.status(500).json({ error: 'Failed to save marks' });
  }
});

router.get('/by-institute-department', async (req, res) => {
  const { institute, department } = req.query;
  console.log('Received query:', { institute, department });

  try {
    const marks = await sequelize.query(
      `SELECT m.student_id, m.subject_id, m.marks
       FROM marks m
       JOIN students s ON m.student_id = s.id
       JOIN subjects subj ON m.subject_id = subj.id
       WHERE LOWER(REPLACE(s.institute, ' ', '-')) = ?
         AND LOWER(REPLACE(s.department, ' ', '-')) = ?`,
      {
        replacements: [institute, department],
        type: QueryTypes.SELECT,
      }
    );

    console.log('Fetched marks:', marks);
    res.json(marks);
  } catch (error) {
    console.error('Failed to fetch marks:', error);
    res.status(500).json({ error: 'Failed to fetch marks', details: error.message });
  }
});

// Get all marks (for admin resultsheet)
router.get('/all', async (req, res) => {
  try {
    const marks = await sequelize.query(
      `SELECT m.student_id, m.subject_id, m.marks
       FROM marks m`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(marks);
  } catch (error) {
    console.error('Failed to fetch all marks:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});


module.exports = router;
