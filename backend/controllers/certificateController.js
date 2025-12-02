// backend/controllers/certificateController.js

const mysql = require("mysql2"); // MySQL package

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Controller function to get a student's certificate by their ID
const getStudentCertificate = async (req, res) => {
  const { student_id } = req.params;

  try {
    // Use MySQL query to get the certificate along with student and course details
    const sql = `
      SELECT c.*, s.name AS student_name, s.email AS student_email, co.course_name
      FROM certificates c
      JOIN students s ON c.student_id = s.id
      JOIN courses co ON c.course_id = co.id
      WHERE c.student_id = ?
    `;
    db.query(sql, [student_id], (err, results) => {
      if (err) {
        console.error("Error fetching certificate:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No certificate found for this student." });
      }

      // Return the certificate details along with student and course information
      const certificate = results[0]; // Assuming only one result per student
      res.json(certificate);
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getStudentCertificate };
