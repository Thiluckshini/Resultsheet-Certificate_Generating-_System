// backend/controllers/pdfController.js

const mysql = require("mysql2");
const { generateResultPDF, generateCertificatePDF } = require("../utils/pdfGenerator");

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Download result sheet for a student
const downloadResultSheet = async (req, res) => {
  const { student_id } = req.params;
  const filePath = `./results/result_${student_id}.pdf`;

  try {
    // Fetch result and marks for the student from MySQL
    const resultQuery = "SELECT * FROM results WHERE student_id = ?";
    db.query(resultQuery, [student_id], async (err, result) => {
      if (err) {
        console.error("Error fetching result:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.length === 0) return res.status(404).json({ message: "No result found" });

      const marksQuery = "SELECT * FROM marks WHERE student_id = ?";
      db.query(marksQuery, [student_id], async (err, marks) => {
        if (err) {
          console.error("Error fetching marks:", err);
          return res.status(500).json({ message: "Server error" });
        }

        const student = { name: "Student Name", course: "Course Name" }; // Fetch from DB if needed
        await generateResultPDF(student, marks, result[0].gpa, filePath);

        res.download(filePath, `Result_${student_id}.pdf`);
      });
    });
  } catch (error) {
    console.error("Error generating result sheet PDF:", error);
    res.status(500).json({ message: "Error generating PDF", error });
  }
};

// Download certificate for a student
const downloadCertificate = async (req, res) => {
  const { student_id } = req.params;
  const filePath = `./certificates/certificate_${student_id}.pdf`;

  try {
    // Fetch certificate from MySQL
    const certificateQuery = "SELECT * FROM certificates WHERE student_id = ?";
    db.query(certificateQuery, [student_id], async (err, certificate) => {
      if (err) {
        console.error("Error fetching certificate:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (certificate.length === 0) return res.status(404).json({ message: "No certificate found" });

      const student = { name: "Student Name", course: "Course Name" }; // Fetch from DB if needed
      await generateCertificatePDF(student, certificate[0].classification, filePath);

      res.download(filePath, `Certificate_${student_id}.pdf`);
    });
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    res.status(500).json({ message: "Error generating PDF", error });
  }
};

module.exports = { downloadResultSheet, downloadCertificate };
