const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.status(400).json({ message: "Username and role are required." });
  }

  // Mock user lookup by role and username
  const user = await findUserByUsernameAndRole(username, role);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Send password reset link via email
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your-email@example.com", // Replace with your email
        pass: "your-email-password",     // Replace with your email password
      },
    });

    const resetLink = `http://yourdomain.com/reset-password?token=${user.resetToken}`;
    
    await transporter.sendMail({
      from: "your-email@example.com", // Replace with your email
      to: user.email,  // Replace with the user's email
      subject: "Password Reset Request",
      text: `To reset your password, click the following link: ${resetLink}`,
    });

    res.status(200).json({ message: "Password reset link sent." });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ message: "Error sending reset email." });
  }
});

const findUserByUsernameAndRole = (username, role) => {
  // Mock implementation to find the user based on role and username
  // You should replace this with actual database lookup logic
  return { email: "user@example.com", resetToken: "some-random-token" };
};

module.exports = router;
