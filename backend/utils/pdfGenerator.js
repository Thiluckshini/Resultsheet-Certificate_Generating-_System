// backend/utils/pdfGenerator.js

const PDFDocument = require("pdfkit");
const fs = require("fs");
const Student = require("../models/Student"); // Sequelize model for students
const Mark = require("../models/Mark"); // Sequelize model for marks

// Generate Result PDF based on SQL data
const generateResultPDF = async (studentId, filePath) => {
  try {
    // Fetch student and marks data from SQL database
    const student = await Student.findByPk(studentId); // Using Sequelize's findByPk for primary key
    if (!student) throw new Error("Student not found");

    const marks = await Mark.findAll({ where: { studentId } });
    if (marks.length === 0) throw new Error("No marks found for this student");

    // Calculate GPA
    const totalPoints = marks.reduce((acc, { score }) => {
      if (score >= 85) acc += 4.0;
      else if (score >= 70) acc += 3.0;
      else if (score >= 55) acc += 2.0;
      else if (score >= 40) acc += 1.0;
      else acc += 0.0;
      return acc;
    }, 0);

    const gpa = (totalPoints / marks.length).toFixed(2);

    // Create PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(16).text("Student Result Sheet", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Student: ${student.name}`);
    doc.text(`Course: ${student.course}`);
    doc.moveDown();

    doc.fontSize(14).text("Marks:");
    marks.forEach(({ subject, score }) => {
      doc.fontSize(12).text(`${subject}: ${score}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`GPA: ${gpa}`);
    doc.end();

    stream.on("finish", () => {
      console.log("Result PDF generated successfully");
    });

    stream.on("error", (err) => {
      throw new Error("Error generating PDF: " + err.message);
    });

    return filePath; // Return the path of the generated PDF

  } catch (err) {
    console.error("Error generating result PDF: ", err);
    throw err;
  }
};

// Generate Certificate PDF based on SQL data
const generateCertificatePDF = async (studentId, classification, filePath) => {
  try {
    // Fetch student data from SQL database
    const student = await Student.findByPk(studentId); // Using Sequelize's findByPk for primary key
    if (!student) throw new Error("Student not found");

    // Create PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("Certificate of Completion", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`This certifies that ${student.name}`);
    doc.text(`has successfully completed ${student.course}`);
    doc.moveDown();
    doc.fontSize(16).text(`Awarded: ${classification}`, { align: "center" });

    doc.end();

    stream.on("finish", () => {
      console.log("Certificate PDF generated successfully");
    });

    stream.on("error", (err) => {
      throw new Error("Error generating PDF: " + err.message);
    });

    return filePath; // Return the path of the generated PDF

  } catch (err) {
    console.error("Error generating certificate PDF: ", err);
    throw err;
  }
};

module.exports = { generateResultPDF, generateCertificatePDF };
