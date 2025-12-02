const mysql = require('mysql2');
require('dotenv').config(); // To load from .env

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'results_db',
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
  } else {
    console.log("✅ MySQL connected successfully!");
    connection.end();
  }
});
