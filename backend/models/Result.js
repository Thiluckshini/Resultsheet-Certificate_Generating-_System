// backend/models/Result.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Result extends Model {}

Result.init({
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  student_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institute: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  marks: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Result',
  tableName: 'results', // This table probably doesn't exist, so consider using raw queries in routes instead
  timestamps: false,
});

module.exports = Result;
