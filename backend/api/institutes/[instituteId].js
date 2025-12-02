// backend/api/institutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db"); 

// Get all institutes
router.get("/", (req, res) => {
  const query = "SELECT * FROM institutes"; 

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching institutes:", err);
      return res.status(500).json({ message: "Server Error" });
    }

    console.log("Institutes:", results);
    res.json(results);  // Send back all institutes
  });
});

// Get a single institute by its ID (Dynamic Route)
router.get("/:id", (req, res) => {
  const instituteId = req.params.id;  

  // Query to get a single institute based on the instituteId
  const query = "SELECT * FROM institutes WHERE id = ?";

  db.query(query, [instituteId], (err, results) => {
    if (err) {
      console.error("Error fetching institute:", err);
      return res.status(500).json({ message: "Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Institute not found" });  
    }

    console.log("Institute:", results[0]);
    res.json(results[0]);  
  });
});

module.exports = router;
