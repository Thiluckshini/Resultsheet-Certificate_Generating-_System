// routes/instituteRoutes.js

const express = require('express');
const multer = require('multer');
const {
  addInstitute,
  getInstitutes,
  deleteInstituteById
} = require('../controllers/instituteController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.get('/', getInstitutes);         // ✅ This defines GET /api/institutes
router.post('/', upload.single('logo'), addInstitute);
router.delete('/:id', deleteInstituteById);

module.exports = router;
