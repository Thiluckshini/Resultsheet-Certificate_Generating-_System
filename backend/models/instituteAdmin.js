const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Correct path to sequelize connection

const InstituteAdmin = sequelize.define('InstituteAdmin', {
  admin_id: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nic: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  institute: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
}, {
  tableName: 'institute_admins',
  timestamps: false  // Assuming your table does not use 'createdAt' and 'updatedAt' fields
});

// Adding methods if necessary, for instance:
// Method to get all admins
InstituteAdmin.getAll = () => {
  return InstituteAdmin.findAll();
};

// Method to delete an admin by primary key
InstituteAdmin.delete = (id) => {
  return InstituteAdmin.destroy({ where: { id } });
};

module.exports = InstituteAdmin;
