// backend/models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// For class-based models:
db.Course = require('./Course');
db.Lecturer = require('./Lecturer');
db.InstituteAdmin = require('./instituteAdmin');
db.Department = require('./Department');
db.Student = require('./Student');
const SubjectModel = require('./Subject');
db.Subject = SubjectModel(sequelize, Sequelize.DataTypes);  // ✅ Correctly initialize the model
const MarkModel = require('./Mark');
db.Mark = MarkModel(sequelize, Sequelize.DataTypes);

// OR better, convert Subject to class style as well for consistency

module.exports = db;
