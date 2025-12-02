// backend/models/Student.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('Student', {
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
  student_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  nic: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  contact_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  course: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
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
  tableName: 'students',
  timestamps: false,
});

module.exports = Student;
