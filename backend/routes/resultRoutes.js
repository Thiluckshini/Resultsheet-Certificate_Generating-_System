// backend/routes/resultRoutes.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

// GET /api/resultsheets
router.get('/', async (req, res) => {
  try {
    // Query: join students, subjects, marks to get results with grouping info
    const results = await sequelize.query(`
      SELECT 
        s.institute,
        s.department,
        subj.semester,
        s.id AS student_id,
        s.name AS student_name,
        subj.name AS subject_name,
        m.marks
      FROM marks m
      JOIN students s ON m.student_id = s.id
      JOIN subjects subj ON m.subject_id = subj.id
      ORDER BY s.institute, s.department, subj.semester, s.name, subj.name
    `, {
      type: QueryTypes.SELECT,
    });

    // Now group results by institute > department > semester
    const grouped = {};

    results.forEach(row => {
      const { institute, department, semester } = row;

      if (!grouped[institute]) grouped[institute] = {};
      if (!grouped[institute][department]) grouped[institute][department] = {};
      if (!grouped[institute][department][semester]) grouped[institute][department][semester] = [];

      grouped[institute][department][semester].push(row);
    });

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching resultsheets:', error);
    res.status(500).json({ error: 'Failed to fetch resultsheets' });
  }
});

module.exports = router;
