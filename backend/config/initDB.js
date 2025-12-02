// backend/config/initDB.js

require('dotenv').config();

const db = require('../config/db'); // MySQL connection

// Import table creation functions
const { createUserTable } = require('../models/User');
const { createCourseTable } = require('../models/Course');
const { createStudentTable } = require('../models/Student');
const { createLecturerTable } = require('../models/Lecturer');
const { createMarksTable } = require('../models/Marks');
const { createResultsTable } = require('../models/Results');
const { createCertificateTable } = require('../models/Certificate');

// Initialize Database
const initializeDatabase = async () => {
  try {
    console.log("Initializing Database...");

    await createUserTable();
    await createCourseTable();
    await createStudentTable();
    await createLecturerTable();
    await createMarksTable();
    await createResultsTable();
    await createCertificateTable();

    console.log("Database Initialized Successfully ✅");
  } catch (error) {
    console.error("Database Initialization Failed ❌", error);
  } finally {
    db.end(); // Close MySQL connection
    process.exit();
  }
};

initializeDatabase();
