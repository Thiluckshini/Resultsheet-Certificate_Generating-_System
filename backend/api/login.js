const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.post("/", async (req, res) => {
  let { username, password, role, institute } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  role = role.toLowerCase().replace(/\s+/g, '-');
  username = username.toLowerCase();

  if (role === "institute-admin") {
    if (!institute) {
      return res.status(400).json({ message: "Institute is required for admin login" });
    }

    const query = "SELECT * FROM institute_admins WHERE admin_id = ? AND institute = ?";
    db.query(query, [username, institute], (err, results) => {
      if (err) {
        console.error("Institute Admin login error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid admin ID or institute" });
      }

      const admin = results[0];

      // Compare NIC directly (assuming plain NIC stored)
      if (admin.nic !== password) {
        return res.status(400).json({ message: "Invalid NIC number" });
      }

      const token = jwt.sign(
        { adminId: admin.admin_id, role: "institute-admin", institute: admin.institute },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        admin_id: admin.admin_id,
        institute: admin.institute,
        role: "institute-admin"
      });
    });
  } else {
    const query = "SELECT * FROM users WHERE username = ? AND role = ?";
    db.query(query, [username, role], async (err, results) => {
      if (err) {
        console.error("User login error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token, role: user.role });
    });
  }
});

module.exports = router;
