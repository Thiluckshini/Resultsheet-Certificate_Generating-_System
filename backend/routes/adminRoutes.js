// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assume you have a MySQL connection set up in this file

// Route for adding a new institute
router.post('/admin/institutes', async (req, res) => {
  try {
    const { name, location, establishedYear, logoUrl } = req.body;

    // Check if all required fields are provided
    if (!name || !location || !establishedYear || !logoUrl) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Insert new institute into the database
    const query = 'INSERT INTO institutes (name, location, establishedYear, logoUrl) VALUES (?, ?, ?, ?)';
    const [result] = await db.promise().query(query, [name, location, establishedYear, logoUrl]);

    // Return the created institute as JSON response
    res.status(201).json({
      id: result.insertId,
      name,
      location,
      establishedYear,
      logoUrl
    });
  } catch (error) {
    console.error('Error adding institute:', error);
    res.status(500).json({ message: 'Failed to add institute' });
  }
});

// Route for fetching all institutes
router.get('/admin/institutes', async (req, res) => {
  try {
    // Fetch all institutes from the database
    const query = 'SELECT * FROM institutes';
    const [institutes] = await db.promise().query(query);

    // Return the list of institutes as JSON
    res.status(200).json(institutes);
  } catch (error) {
    console.error("Error fetching institutes:", error);
    res.status(500).json({ message: "Failed to fetch institutes" });
  }
});


module.exports = router;
