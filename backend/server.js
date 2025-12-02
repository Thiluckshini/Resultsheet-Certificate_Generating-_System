// backend/server.js

// backend/server.js

const express = require("express");
const cors = require('cors');
const session = require('express-session');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const sequelize = require("./config/db"); // Sequelize instance
const lecturerRoutes = require('./routes/lecturerRoutes'); // import lecturer routes
const departmentRoutes = require('./routes/departmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const instituteRoutes = require('./routes/instituteRoutes'); // Adjust path as needed
const markRoutes = require('./routes/markRoutes');
const resultRoutes = require('./routes/resultRoutes'); // <-- Add this line

dotenv.config();

// Global error handlers
process.on('uncaughtException', err => {
  console.error('💥 Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Main DB connection retry logic
async function connectWithRetry(retries = 5, delay = 2000) {
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("✅ Connected to SQL Database!");
      startServer();
      break;
    } catch (err) {
      console.error("❌ DB connection failed. Retrying...", err.message);
      retries--;
      if (retries === 0) {
        console.error("❌ All retry attempts failed. Exiting.");
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

function startServer() {
  const app = express();

  // Create uploads directory if not exist
  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  // Serve uploads folder statically
  app.use('/uploads', express.static(uploadDir));

  // Logging middleware (optional)
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Middleware
  app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'your-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true if using HTTPS
  }));

  // Default test route
  app.get('/', (req, res) => res.send('🎉 API is working!'));

  // Routes
  app.use('/api/institutes', instituteRoutes); // <-- This is crucial
  app.use('/api/lecturers', lecturerRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/subjects', subjectRoutes);
  app.use('/api/marks', markRoutes);
app.use('/api/resultsheets', resultRoutes);

  app.use('/api/getUserInstitute', require('./routes/getUserInstitute'));
  app.use('/login', require('./api/login'));
  app.use('/register', require('./routes/register'));
  app.use('/api/forgotPassword', require('./routes/forgotPassword'));
  app.use('/api/institute-admins', require('./routes/institute-adminRoutes'));
  app.use('/api/certificates', require('./routes/certificateRoutes'));

  //app.use('/api/results', require('./routes/resultRoutes'));
  app.use('/api/students', require('./routes/studentRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/recent-activities', require('./api/recent-activities'));

  // Error handling middleware (optional)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
  });

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}

// Start DB Connection + Server
connectWithRetry();
