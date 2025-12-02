const InstituteAdmin = require('../models/instituteAdmin');

// Controller to fetch all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await InstituteAdmin.getAll();
    res.json(admins);
  } catch (error) {
    console.error('❌ Error fetching admins:', error);
    res.status(500).json({ error: 'Failed to retrieve admins.' });
  }
};

// Controller to create a new admin
const createAdmin = async (req, res) => {
  try {
    const { admin_id, name, nic, email, contact, address, institute } = req.body;

    const newAdmin = await InstituteAdmin.create({
      admin_id,
      name,
      nic,
      email,
      contact,
      address,
      institute,
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    res.status(500).json({ error: 'Failed to create admin.' });
  }
};

// Controller to delete an admin
const deleteAdmin = async (req, res) => {
  try {
    const affectedRows = await InstituteAdmin.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found.' });
    }
    res.json({ message: 'Admin deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting admin:', error);
    res.status(500).json({ error: 'Failed to delete admin.' });
  }
};

module.exports = {
  getAllAdmins,
  createAdmin,
  deleteAdmin,
};
