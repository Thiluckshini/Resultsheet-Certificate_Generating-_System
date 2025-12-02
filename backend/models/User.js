// backend/models/User.js

const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create User Table (if not already created)
// You can run this query to create the user table with required columns in MySQL

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'lecturer', 'student') NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  await db.promise().query(query);
};

// Add User
const addUser = async (name, email, password, role) => {
  try {
    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const [results] = await db.promise().query(query, [name, email, hashedPassword, role]);

    return { id: results.insertId, name, email, role };
  } catch (error) {
    throw new Error("Error adding user: " + error.message);
  }
};

// Match Password (for login)
const matchPassword = async (email, enteredPassword) => {
  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.promise().query(query, [email]);

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(enteredPassword, user.password);

    return isMatch ? user : null;
  } catch (error) {
    throw new Error("Error matching password: " + error.message);
  }
};

// Get User by ID
const getUserById = async (id) => {
  try {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.promise().query(query, [id]);

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    return rows[0];
  } catch (error) {
    throw new Error("Error retrieving user: " + error.message);
  }
};

module.exports = { createUserTable, addUser, matchPassword, getUserById };
