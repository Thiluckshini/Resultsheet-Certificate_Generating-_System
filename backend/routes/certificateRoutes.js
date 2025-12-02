// backend/routes/certificateRoutes.js

const db = require("../config/db"); // MySQL connection
const router = require("./markRoutes");

// Function to fetch a student's certificate
const getStudentCertificate = async (req, res) => {
  const { student_id } = req.params;

  try {
    // Fetch student certificate details by student_id
    const [certificate] = await db.promise().query("SELECT * FROM certificates WHERE student_id = ?", [student_id]);

    if (certificate.length === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Return the certificate data
    res.status(200).json(certificate[0]);
  } catch (error) {
    console.error("Error fetching student certificate:", error);
    res.status(500).json({ message: "Server error while fetching certificate", error: error.message });
  }
};

router.post('/get', getStudentCertificate);

module.exports = router;