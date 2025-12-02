// backend/middleware/auth.js

const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No Token Provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from MySQL using the decoded token's id
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request
      req.user = results[0]; // Assuming results[0] is the user
      next();
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid Token", error: err.message });
  }
};
