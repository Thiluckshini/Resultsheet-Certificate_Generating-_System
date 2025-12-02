const Institute = require('../models/Institute');

// Add a new institute
const addInstitute = async (req, res) => {
  try {
    const { name, location, establishedYear } = req.body;
    const logo = req.file ? req.file.path : null;

    const newInstitute = await Institute.saveInstitute(name, location, establishedYear, logo);

    res.status(201).json(newInstitute);
  } catch (error) {
    console.error('Error adding institute:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all institute
const getInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.getAllInstitutes(); // Fix applied here
    res.json(institutes);
  } catch (err) {
    console.error("Failed to fetch institutes:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};



const { deleteInstitute } = require('../models/Institute');

const deleteInstituteById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteInstitute(id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting institute:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addInstitute, getInstitutes, deleteInstituteById };

