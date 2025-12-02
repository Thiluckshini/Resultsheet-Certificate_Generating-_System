// backend/controllers/markController.js

const Mark = require('../models/mark'); // Adjust path if needed

const createMark = (req, res) => {
  const { student_id, course_id, marks } = req.body;

  // Your logic to create a mark
  Mark.create({ student_id, course_id, marks })
    .then((mark) => res.status(201).json(mark))
    .catch((err) => res.status(400).json({ error: err.message }));
};

module.exports = { createMark };
 