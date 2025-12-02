// backend/routes/userRoutes.js

const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { protect, isAdmin } = require("../config/authMiddleware");

const router = express.Router();

// Register a user (Only accessible by an admin)
router.post("/register", protect, isAdmin, registerUser);

// Login a user (Accessible by anyone)
router.post("/login", loginUser);

// Define your routes
router.get("/", (req, res) => {
  res.send("User route");
});

// Export the router correctly

module.exports = router;