const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { activity: 'New student added', date: '2025-04-14' },
    { activity: 'Lecturer profile updated', date: '2025-04-13' }
  ]);
});

module.exports = router;
