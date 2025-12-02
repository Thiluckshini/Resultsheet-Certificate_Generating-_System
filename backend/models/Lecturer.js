// backend/models/Lecturer.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lecturer = sequelize.define('Lecturer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  lecturer_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  nic: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  institute: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'lecturers',
  timestamps: false,
});

module.exports = Lecturer;
