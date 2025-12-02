const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    if (!userEmail) {
      return res.status(401).json({ error: 'Unauthorized: Missing user email' });
    }

    // Query to find the institute name for this admin
    const [rows] = await pool.query(
      'SELECT institute FROM institute_admins WHERE email = ? LIMIT 1',
      [userEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Institute admin not found' });
    }

    const instituteName = rows[0].institute;

    // Fetch institute details
    const [instituteRows] = await pool.query(
      'SELECT id, name, location, establishedYear, logoUrl FROM institutes WHERE name = ? LIMIT 1',
      [instituteName]
    );

    if (instituteRows.length === 0) {
      return res.status(404).json({ error: 'Institute details not found' });
    }

    res.status(200).json({ institute: instituteRows[0] });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
