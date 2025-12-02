// backend/config/authMiddleware.js

const jwt = require("jsonwebtoken");
const db = require("../config/db"); // MySQL connection

const protect = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    // Fetch the user from MySQL by user ID
    const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';
    db.query(query, [decoded.userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: "User not found." });
      }

      req.user = results[0]; // Attach user to request
      next();
    });

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check Admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { protect, isAdmin };
