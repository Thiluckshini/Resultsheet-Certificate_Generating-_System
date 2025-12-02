const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, institute } = req.body;

    if (!username || !email || !password || !role || !institute) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Register the user in the database (you'll have your logic here)
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
