const express = require('express');
const router = express.Router();
const InstituteAdmin = require('../models/instituteAdmin');

// Get all admins
router.get('/', async (req, res) => {
  try {
    const admins = await InstituteAdmin.getAll();
    res.json(admins);
  } catch (error) {
    console.error('❌ Error fetching admins:', error);
    res.status(500).json({ error: 'Failed to retrieve admins.' });
  }
});

// Add a new admin
router.post('/', async (req, res) => {
  try {
    const { admin_id, name, nic, email, contact, address, institute } = req.body;

    if (!admin_id || !name || !nic || !email || !contact || !address || !institute) {
      return res.status(400).send('All fields are required.');
    }

    // Check if admin_id already exists
    const existingAdmin = await InstituteAdmin.findOne({ where: { admin_id } });
    if (existingAdmin) {
      return res.status(409).send('Admin ID already exists.');
    }

    const newAdmin = await InstituteAdmin.create({ admin_id, name, nic, email, contact, address, institute });
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    res.status(500).send('Server error');
  }
});

// Delete an admin by ID
router.delete('/:id', async (req, res) => {
  try {
    const admin = await InstituteAdmin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).send('Admin not found.');
    }

    await admin.destroy();
    res.send('Admin deleted successfully.');
  } catch (error) {
    console.error("❌ Error deleting admin:", error);
    res.status(500).send('Server error');
  }
});

// Update an admin by ID
router.put('/:id', async (req, res) => {
  try {
    const { admin_id, name, nic, email, contact, address, institute } = req.body;

    if (!admin_id || !name || !nic || !email || !contact || !address || !institute) {
      return res.status(400).send('All fields are required.');
    }

    const admin = await InstituteAdmin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).send('Admin not found.');
    }

    // Check if admin_id is being changed to one that already exists
    if (admin.admin_id !== admin_id) {
      const existingAdmin = await InstituteAdmin.findOne({ where: { admin_id } });
      if (existingAdmin) {
        return res.status(409).send('Admin ID already exists.');
      }
    }

    await admin.update({ admin_id, name, nic, email, contact, address, institute });
    res.json(admin);
  } catch (error) {
    console.error("❌ Error updating admin:", error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
