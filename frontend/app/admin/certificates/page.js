'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';

export default function AdminCertificatesPage() {
  const [studentsByInstitute, setStudentsByInstitute] = useState({});
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [expandedInstitutes, setExpandedInstitutes] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [expandedYears, setExpandedYears] = useState({});
  const [marksMap, setMarksMap] = useState({});

  const normalizeKey = (str) =>
    str?.toLowerCase().trim().replace(/\s+/g, '-') || 'unknown';

  const formatName = (str) =>
    str
      ?.toLowerCase()
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  useEffect(() => {
    async function fetchData() {
      try {
        const [instRes, studRes, marksRes] = await Promise.all([
          fetch('http://localhost:5000/api/institutes'),
          fetch('http://localhost:5000/api/students'),
          fetch('http://localhost:5000/api/marks/all'),
        ]);

        if (!instRes.ok || !studRes.ok || !marksRes.ok)
          throw new Error('Failed to fetch data');

        const [instData, studData, marksData] = await Promise.all([
          instRes.json(),
          studRes.json(),
          marksRes.json(),
        ]);

        setAllInstitutes(instData);

        // Group students by institute -> department
        const groupedStudents = {};
        studData.forEach((student) => {
          const instKey = normalizeKey(student.institute);
          const deptKey = normalizeKey(student.department);

          if (!groupedStudents[instKey]) {
            groupedStudents[instKey] = { displayName: student.institute, departments: {} };
          }
          if (!groupedStudents[instKey].departments[deptKey]) {
            groupedStudents[instKey].departments[deptKey] = {
              displayName: student.department,
              students: [],
            };
          }
          groupedStudents[instKey].departments[deptKey].students.push(student);
        });
        setStudentsByInstitute(groupedStudents);

        // Build marks map { student_id: [marks, marks, ...], ... }
        const marksMapTemp = {};
        marksData.forEach(({ student_id, marks }) => {
          const idKey = student_id?.toString().trim();
          if (!marksMapTemp[idKey]) marksMapTemp[idKey] = [];
          marksMapTemp[idKey].push(Number(marks));
        });
        setMarksMap(marksMapTemp);
      } catch (err) {
        console.error(err);
        alert('Error fetching data.');
      }
    }
    fetchData();
  }, []);

  // Calculate overall GPA from all marks for a student (simple average)
  const calculateOverallGpa = (studentId) => {
    const marks = marksMap?.[studentId] || [];
    if (marks.length === 0) return 0;

    // Convert marks to GPA points (scale 0 to 4)
    const totalPoints = marks.reduce((sum, mark) => sum + convertMarkToGpa(mark), 0);
    return totalPoints / marks.length;
  };

  // Convert mark to GPA points (simple scale)
  const convertMarkToGpa = (mark) => {
    if (mark >= 90) return 4.0;
    if (mark >= 80) return 3.7;
    if (mark >= 70) return 3.0;
    if (mark >= 60) return 2.0;
    if (mark >= 50) return 1.0;
    return 0.0;
  };

  // GPA Classification
  const getClassification = (gpa) => {
    if (gpa >= 3.7) return 'First Class';
    if (gpa >= 3.0) return 'Second Class Upper';
    if (gpa >= 2.0) return 'Second Class Lower';
    if (gpa >= 1.0) return 'Third Class';
    return 'Fail';
  };

  const toggleInstitute = (instKey) => {
    setExpandedInstitutes((prev) => ({ ...prev, [instKey]: !prev[instKey] }));
  };

  const toggleDepartment = (instKey, deptKey) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [instKey]: {
        ...prev[instKey],
        [deptKey]: !prev[instKey]?.[deptKey],
      },
    }));
  };

  const toggleYear = (instKey, deptKey, year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [instKey]: {
        ...prev[instKey],
        [deptKey]: {
          ...prev[instKey]?.[deptKey],
          [year]: !prev[instKey]?.[deptKey]?.[year],
        },
      },
    }));
  };

  // Generate PDF Certificate for a student
  const generateCertificatePdf = (student) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    const margin = 40;
    const lineHeight = 28;
    let y = 100;
  
    const instituteName = formatName(student.institute);
    const departmentName = formatName(student.department);
    const studentName = student.name || 'Student';
    const studentId = student.student_id || student.id || 'N/A';
  
    const gpa = calculateOverallGpa(studentId).toFixed(2);
    const classification = getClassification(Number(gpa));
  
    // Gold outer border
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(4);
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40);
  
    // Inner border
    doc.setLineWidth(1.5);
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60);
  
    // Title
    doc.setFont('times', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(0, 0, 0);
    doc.text('Certificate of Completion', pageWidth / 2, y, { align: 'center' });
    y += 40;
  
    // Subtitle
    doc.setFontSize(16);
    doc.setFont('times', 'normal');
    doc.text('This is to certify that', pageWidth / 2, y, { align: 'center' });
    y += lineHeight;
  
    // Student Name
    doc.setFontSize(22);
    doc.setFont('times', 'bolditalic');
    doc.text(studentName, pageWidth / 2, y, { align: 'center' });
    y += lineHeight;
  
    // Completion message
    doc.setFontSize(16);
    doc.setFont('times', 'normal');
    doc.text('has successfully completed the program in', pageWidth / 2, y, { align: 'center' });
    y += lineHeight;
  
    // Department
    doc.setFont('times', 'bold');
    doc.text(departmentName, pageWidth / 2, y, { align: 'center' });
    y += lineHeight;
  
    // Institute and GPA
    doc.setFont('times', 'normal');
    doc.text(`at ${instituteName} with a GPA of ${gpa} (${classification}).`, pageWidth / 2, y + 20, { align: 'center' });
    y += 50;
  
    // Student ID
    doc.setFontSize(14);
    doc.text(`Student ID: ${studentId}`, pageWidth / 2, y, { align: 'center' });
    y += 60;
  
    // Signature line
    const sigY = pageHeight - margin - 50;
    const sigWidth = 160;
    doc.setLineWidth(0.8);
    doc.setDrawColor(0);
    doc.line(pageWidth / 2 - sigWidth / 2, sigY, pageWidth / 2 + sigWidth / 2, sigY);
  
    doc.setFontSize(12);
    doc.text('Authorized Signature', pageWidth / 2, sigY + 15, { align: 'center' });
  
    // Date issued
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Date Issued: ${today}`, pageWidth - 40, pageHeight - 30, {
      align: 'right',
    });
  
    // Save PDF
    doc.save(`Certificate_${studentName}_${studentId}.pdf`);
  };
  
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">Certificates by Institute</h1>
          {allInstitutes.length === 0 && (
            <p className="italic text-gray-500">No institutes available.</p>
          )}
          {Object.keys(studentsByInstitute).length === 0 && allInstitutes.length > 0 && (
            <p className="italic text-gray-500">No students found.</p>
          )}
          {allInstitutes.map((inst) => {
            const instKey = normalizeKey(inst.name);
            const isInstExpanded = expandedInstitutes[instKey] || false;
            const departments = studentsByInstitute[instKey]?.departments || {};

            return (
              <div key={instKey} className="mb-6">
                <button
                  onClick={() => toggleInstitute(instKey)}
                  className="w-full bg-white hover:bg-blue-100 text-left text-xl font-semibold text-blue-800 px-6 py-3 rounded shadow mb-2 transition-all"
                >
                  {isInstExpanded ? '▼' : '▶'} {formatName(inst.name)}
                </button>

                {isInstExpanded && (
                  <div className="bg-white p-4 rounded shadow-md">
                    {Object.entries(departments).map(([deptKey, deptData]) => {
                      const isDeptExpanded = expandedDepartments[instKey]?.[deptKey] || false;

                      // Extract unique years from students in this department
                      const years = Array.from(
                        new Set(deptData.students.map((s) => s.year || 'Unknown'))
                      ).sort();

                      return (
                        <div key={deptKey} className="mb-6">
                          <button
                            onClick={() => toggleDepartment(instKey, deptKey)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
                          >
                            {isDeptExpanded ? '▼' : '▶'} Department: {formatName(deptData.displayName)}
                          </button>

                          {isDeptExpanded && (
                            <div>
                              {/* Year buttons */}
                              {/* Year buttons */}
<div className="mb-6">
  {years.map((year) => {
    const isYearExpanded = expandedYears[instKey]?.[deptKey]?.[year] || false;
    return (
      <button
        key={year}
        onClick={() => toggleYear(instKey, deptKey, year)}
        className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
      >
        {isYearExpanded ? '▼' : '▶'} Year {year}
      </button>
    );
  })}
</div>

{/* Show table only if a year is expanded */}
{years.map((year) => {
  const isYearExpanded = expandedYears[instKey]?.[deptKey]?.[year] || false;
  if (!isYearExpanded) return null;

  const studentsForYear = deptData.students.filter(
    (s) => (s.year || 'Unknown') === year
  );

  return (
    <div key={year} className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentsForYear.map((student) => {
            const studentId = student.student_id || student.id;
            const gpa = calculateOverallGpa(studentId).toFixed(2);
            const classification = getClassification(Number(gpa));
            return (
              <tr key={studentId} className="even:bg-gray-50">
                <td className="border px-4 py-2">{studentId}</td>
                <td className="border px-4 py-2">{student.name}</td>
               
                  <td className="border px-4 py-2 text-center">
                  <button
className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => generateCertificatePdf(student)}
                    
                  >
                    View Certificate
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
})}

                              
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
