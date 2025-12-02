// backend/models/Certificate.js

const mysql = require("mysql2");

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Save Certificate to MySQL
const saveCertificate = async (student_id, course_id, classification) => {
  try {
    const query = "INSERT INTO certificates (student_id, course_id, classification) VALUES (?, ?, ?)";
    const [results] = await db.promise().query(query, [student_id, course_id, classification]);
    return { student_id, course_id, classification, id: results.insertId };
  } catch (error) {
    throw new Error("Error saving certificate: " + error.message);
  }
};

// Get Certificate by Student ID
const getCertificate = async (student_id) => {
  try {
    const query = "SELECT * FROM certificates WHERE student_id = ?";
    const [results] = await db.promise().query(query, [student_id]);

    if (results.length === 0) {
      return [];
    }

    // Assuming you want to return certificates with associated student and course info:
    const courseQuery = "SELECT * FROM courses WHERE id = ?";
    const studentQuery = "SELECT * FROM students WHERE id = ?";

    const certificates = await Promise.all(results.map(async (certificate) => {
      const [student] = await db.promise().query(studentQuery, [certificate.student_id]);
      const [course] = await db.promise().query(courseQuery, [certificate.course_id]);
      return {
        ...certificate,
        student: student[0],
        course: course[0],
      };
    }));

    return certificates;
  } catch (error) {
    throw new Error("Error retrieving certificate: " + error.message);
  }
};

module.exports = { saveCertificate, getCertificate };
