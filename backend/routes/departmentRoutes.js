//backend/routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const { param, query, body, validationResult } = require('express-validator');
const db = require('../models');
const { Department } = db;

router.get('/', async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get departments by institute (with optional pagination)
router.get(
  '/by-institute/:institute',
  [
    param('institute').trim().notEmpty(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const institute = decodeURIComponent(req.params.institute);
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;

    try {
      const { count, rows } = await Department.findAndCountAll({
        where: { institute },
        limit,
        offset,
      });

      res.json({
        total: count,
        page,
        pageSize: limit,
        departments: rows,
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Create a new department
router.post(
  '/',
  [
  
    body('name').trim().notEmpty().withMessage('Department name is required.'),
    body('institute').trim().notEmpty().withMessage('Institute is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newDepartment = await Department.create(req.body);
      res.status(201).json({
        message: 'Department created successfully.',
        department: newDepartment,
      });
    } catch (error) {
      console.error('Error adding department:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Update a department
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID must be an integer.'),
    body('name').optional().trim().notEmpty(),
    body('institute').optional().trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [updated] = await Department.update(req.body, {
        where: { id: req.params.id },
      });

      if (updated) {
        const updatedDepartment = await Department.findByPk(req.params.id);
        res.json({
          message: 'Department updated successfully.',
          department: updatedDepartment,
        });
      } else {
        res.status(404).json({ error: 'Department not found.' });
      }
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Delete a department
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Department.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.json({ message: 'Department deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Department not found.' });
    }
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
