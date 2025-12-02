// backend/controllers/userController.js

const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  // Check if the user already exists
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Error hashing password" });

      // Save the new user
      const insertQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, hashedPassword, role], (err, result) => {
        if (err) return res.status(500).json({ message: "Error saving user" });
        return res.status(201).json({ message: "User registered successfully" });
      });
    });
  });
};

// Login User
const loginUser = (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    // Compare passwords
    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ message: "Login successful", token });
    });
  });
};

module.exports = { registerUser, loginUser };
