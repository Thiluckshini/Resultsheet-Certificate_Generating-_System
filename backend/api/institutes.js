const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection module

// Get all institutes
router.get("/", (req, res) => {
  const query = "SELECT * FROM institutes"; // Update table name if different

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching institutes:", err);
      return res.status(500).json({ message: "Server Error" });
    }

    console.log("Institutes:", results);
    res.json(results);
  });
});

module.exports = router;
