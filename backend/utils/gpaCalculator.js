// backend/utils/gpaCalculator.js

const Mark = require("../models/Mark"); // Sequelize model for Marks
const Student = require("../models/Student"); // Sequelize model for Students

// Calculate GPA based on marks
const calculateGPA = async (studentId) => {
  try {
    // Fetch all marks for the student
    const marks = await Mark.findAll({
      where: { studentId }, // Sequelize condition to filter by studentId
    });

    if (marks.length === 0) return 0; // If no marks, GPA is 0

    let totalPoints = 0;
    let totalSubjects = marks.length;

    marks.forEach(({ score }) => {
      if (score >= 85) totalPoints += 4.0; // A
      else if (score >= 70) totalPoints += 3.0; // B
      else if (score >= 55) totalPoints += 2.0; // C
      else if (score >= 40) totalPoints += 1.0; // D
      else totalPoints += 0.0; // F
    });

    // Calculate GPA
    const gpa = (totalPoints / totalSubjects).toFixed(2);

    // Update the student's GPA in the database
    await Student.update(
      { gpa }, // Fields to update
      { where: { studentId } } // Condition to find the student by studentId
    );

    return gpa; // Return the calculated GPA
  } catch (err) {
    console.error("Error calculating GPA: ", err);
    throw err;
  }
};

module.exports = { calculateGPA };
