// models/Institute.js (Using mysql2)

const mysql = require('mysql2');

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Save Institute to MySQL
const saveInstitute = async (name, location, establishedYear, logoUrl) => {
  try {
    if (establishedYear > new Date().getFullYear()) {
      throw new Error(`${establishedYear} is not a valid established year!`);
    }

    const query = "INSERT INTO institutes (name, location, establishedYear, logoUrl) VALUES (?, ?, ?, ?)";
    const [results] = await db.promise().query(query, [name, location, establishedYear, logoUrl]);
    return { id: results.insertId, name, location, establishedYear, logoUrl };
  } catch (error) {
    throw new Error("Error saving institute: " + error.message);
  }
};

// Get Institute by ID
const getInstituteById = async (id) => {
  try {
    const query = "SELECT * FROM institutes WHERE id = ?";
    const [results] = await db.promise().query(query, [id]);

    if (results.length === 0) {
      throw new Error("Institute not found");
    }

    return results[0];
  } catch (error) {
    throw new Error("Error retrieving institute: " + error.message);
  }
};

// Get All Institutes
const getAllInstitutes = async () => {
  try {
    const query = "SELECT * FROM institutes";
    const [results] = await db.promise().query(query);
    return results;
  } catch (error) {
    throw new Error("Error retrieving institutes: " + error.message);
  }
};

// Update Institute
const updateInstitute = async (id, name, location, establishedYear, logoUrl) => {
  try {
    if (establishedYear > new Date().getFullYear()) {
      throw new Error(`${establishedYear} is not a valid established year!`);
    }

    const query = "UPDATE institutes SET name = ?, location = ?, establishedYear = ?, logoUrl = ? WHERE id = ?";
    const [results] = await db.promise().query(query, [name, location, establishedYear, logoUrl, id]);

    if (results.affectedRows === 0) {
      throw new Error("Institute not found or no change detected");
    }

    return { id, name, location, establishedYear, logoUrl };
  } catch (error) {
    throw new Error("Error updating institute: " + error.message);
  }
};

// Delete Institute
const deleteInstitute = async (id) => {
  try {
    const query = "DELETE FROM institutes WHERE id = ?";
    const [results] = await db.promise().query(query, [id]);

    if (results.affectedRows === 0) {
      throw new Error("Institute not found");
    }

    return { message: "Institute deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting institute: " + error.message);
  }
};

module.exports = {
  saveInstitute,
  getInstituteById,
  getAllInstitutes,
  updateInstitute,
  deleteInstitute
};
