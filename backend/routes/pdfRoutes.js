// backend/routes/pdfRoutes.js

const express = require("express");
const { downloadResultSheet, downloadCertificate } = require("../controllers/pdfController");
const { protect } = require("../config/authMiddleware");

const router = express.Router();

// Route to download the result sheet as a PDF
router.get("/result/:student_id", protect, downloadResultSheet);

// Route to download the certificate as a PDF
router.get("/certificate/:student_id", protect, downloadCertificate);


module.exports = router;