// backend/utils/certificateClassifier.js

const Student = require("../models/Student"); // Sequelize model for the student

// Function to classify the certificate based on GPA
const classifyCertificate = (gpa) => {
  if (gpa >= 3.7) return "First Class";
  if (gpa >= 3.3) return "Second Upper Class";
  if (gpa >= 3.0) return "Second Lower Class";
  if (gpa >= 2.5) return "Pass";
  return "Fail";
};

// Function to update the student's certificate classification in SQL
const updateStudentCertificate = async (studentId, gpa) => {
  const classification = classifyCertificate(gpa);

  try {
    // Update the student's certificate classification in the SQL database
    const student = await Student.update(
      { certificateClassification: classification }, // Fields to update
      {
        where: { studentId: studentId }, // Specify which student to update
        returning: true, // Return the updated student
      }
    );

    // Return the updated student
    if (student[0] === 1) {
      // If update is successful, return the updated student data
      return student[1][0];
    } else {
      throw new Error("Student not found or no changes made.");
    }
  } catch (err) {
    console.error("Error updating student certificate classification: ", err);
    throw err;
  }
};

module.exports = { classifyCertificate, updateStudentCertificate };
