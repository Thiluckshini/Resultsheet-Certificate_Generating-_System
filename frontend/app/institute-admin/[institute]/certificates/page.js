'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import AdminSidebar from '../../../../components/InstituteAdminSidebar';
import AdminTopbar from '../../../../components/InstituteAdminTopbar';

export default function AdminCertificatesPage() {
  const { institute: encodedInstitute } = useParams();
  const [decodedInstitute, setDecodedInstitute] = useState('');
  const [studentsByInstitute, setStudentsByInstitute] = useState({});
  const [marksMap, setMarksMap] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [expandedYears, setExpandedYears] = useState({});

  // Normalize keys for consistent grouping
  const normalizeKey = (str) =>
    str?.toLowerCase().trim().replace(/\s+/g, '-') || 'unknown';

  // Format keys back to display names (capitalized words)
  const formatName = (str) =>
    str
      ?.toLowerCase()
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  // Decode URL param institute
  useEffect(() => {
    if (encodedInstitute) {
      const decoded = decodeURIComponent(encodedInstitute);
      setDecodedInstitute(decoded);
    }
  }, [encodedInstitute]);

  // Fetch students and marks once decodedInstitute ready
  useEffect(() => {
    if (!decodedInstitute) return;

    async function fetchData() {
      try {
        const [studRes, marksRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/students/by-institute?institute=${encodeURIComponent(
              decodedInstitute
            )}`
          ),
          fetch('http://localhost:5000/api/marks/all'),
        ]);

        if (!studRes.ok || !marksRes.ok) throw new Error('Failed to fetch data');

        const [studData, marksData] = await Promise.all([studRes.json(), marksRes.json()]);

        // Filter students by institute
        const filteredStudents = studData.filter(
          (student) => normalizeKey(student.institute) === normalizeKey(decodedInstitute)
        );

        // Group students by department and year
        const groupedStudents = {};
        filteredStudents.forEach((student) => {
          const deptKey = normalizeKey(student.department);
          const yearKey = student.year || 'Unknown Year';

          if (!groupedStudents[deptKey]) {
            groupedStudents[deptKey] = { displayName: student.department, years: {} };
          }
          if (!groupedStudents[deptKey].years[yearKey]) {
            groupedStudents[deptKey].years[yearKey] = [];
          }
          groupedStudents[deptKey].years[yearKey].push(student);
        });
        setStudentsByInstitute(groupedStudents);

        // Map marks by student_id
        const marksMapTemp = {};
        marksData.forEach(({ student_id, marks }) => {
          const idKey = student_id?.toString().trim();
          if (!marksMapTemp[idKey]) marksMapTemp[idKey] = [];
          // We assume marksData contains all marks for the student, or you can extend this if needed
          marksMapTemp[idKey].push(marks);
        });
        setMarksMap(marksMapTemp);
      } catch (err) {
        console.error(err);
        alert('Error fetching data.');
      }
    }
    fetchData();
  }, [decodedInstitute]);

  // Toggle expansions
  const toggleDepartment = (deptKey) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [deptKey]: !prev[deptKey],
    }));
  };

  const toggleYear = (deptKey, yearKey) => {
    setExpandedYears((prev) => ({
      ...prev,
      [deptKey]: {
        ...prev[deptKey],
        [yearKey]: !prev[deptKey]?.[yearKey],
      },
    }));
  };

  // GPA and Classification helpers
  // For demo, compute GPA as average marks (if you have detailed marks, you can improve this)
  const getGpaFromMarks = (studentId) => {
    const marksArr = marksMap[studentId];
    if (!marksArr || marksArr.length === 0) return null;

    const total = marksArr.reduce((acc, m) => acc + Number(m), 0);
    const avg = total / marksArr.length;
    return avg;
  };

  const getClassification = (gpa) => {
    if (gpa === null) return 'No GPA';
    if (gpa >= 85) return 'First Class';
    if (gpa >= 70) return 'Second Class';
    if (gpa >= 60) return 'Pass Class';
    return 'Fail';
  };

  // Generate certificate PDF
  const generateCertificatePdf = (student) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    const gpa = getGpaFromMarks(student.student_id);
    const classification = getClassification(gpa);
  
    // Border Styling (Golden double border)
    doc.setDrawColor(218, 165, 32); // Gold outer
    doc.setLineWidth(4);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setLineWidth(1);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28);
  
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('Certificate of Achievement', pageWidth / 2, 50, { align: 'center' });
  
    // Subtitle
    doc.setFontSize(16);
    doc.setFont('times', 'normal');
    doc.text(`This is to certify that`, pageWidth / 2, 70, { align: 'center' });
  
    // Student Name
    doc.setFontSize(22);
    doc.setFont('times', 'bolditalic');
    doc.text(student.name, pageWidth / 2, 85, { align: 'center' });
  
    // Main content
    doc.setFontSize(16);
    doc.setFont('times', 'normal');
    doc.text(
      `has successfully completed their studies at ${student.institute},`,
      pageWidth / 2,
      100,
      { align: 'center' }
    );
    doc.text(
      `Department of ${student.department}.`,
      pageWidth / 2,
      110,
      { align: 'center' }
    );
  
    // GPA and Classification
    doc.setFont('times', 'normal');
    doc.text(`Classification: ${classification}`, pageWidth / 2, 130, { align: 'center' });
    doc.text(`GPA: ${gpa !== null ? gpa.toFixed(2) : 'N/A'}`, pageWidth / 2, 140, { align: 'center' });
  
    // Student ID
    doc.setFontSize(14);
    doc.text(`Student ID: ${student.student_id}`, pageWidth / 2, 155, { align: 'center' });
  
    // Date and Signature
    const today = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Date Issued: ${today}`, pageWidth - 30, pageHeight - 15, { align: 'right' });
  
    doc.setLineWidth(0.8);
    doc.line(pageWidth / 2 - 40, pageHeight - 40, pageWidth / 2 + 40, pageHeight - 40);
    doc.text('Authorized Signature', pageWidth / 2, pageHeight - 35, { align: 'center' });
  
    doc.save(`${student.name}_certificate.pdf`);
  };
  

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Certificates for Institute: {formatName(decodedInstitute)}
          </h1>

          {Object.keys(studentsByInstitute).length === 0 && (
            <p className="italic text-gray-500">No students found for this institute.</p>
          )}

          {Object.entries(studentsByInstitute).map(([deptKey, deptData]) => {
            const isDeptExpanded = expandedDepartments[deptKey] || false;
            const years = deptData.years;

            return (
              <div key={deptKey} className="mb-6">
                <button
                  onClick={() => toggleDepartment(deptKey)}
                  className="w-full bg-white hover:bg-blue-100 text-left text-xl font-semibold text-blue-800 px-6 py-3 rounded shadow mb-2 transition-all"
                >
                  {isDeptExpanded ? '▼' : '▶'} Department: {formatName(deptData.displayName)}
                </button>

                {isDeptExpanded && (
                  <div className="bg-white p-4 rounded shadow-md">
                    {Object.entries(years).map(([year, students]) => {
                      const isYearExpanded = expandedYears[deptKey]?.[year] || false;

                      return (
                        <div key={year} className="mb-6">
                          <button
                            onClick={() => toggleYear(deptKey, year)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
                          >
                            {isYearExpanded ? '▼' : '▶'} Year: {formatName(year)}
                          </button>

                          {isYearExpanded && (
                            <div className="overflow-x-auto">
                              <table className="w-full table-auto border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Name</th>
                                    <th className="border px-4 py-2">Actions</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {students.map((student) => {
                                    const gpa = getGpaFromMarks(student.student_id);
                                    const classification = getClassification(gpa);

                                    return (
                                      <tr
                                        key={student.student_id || student.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="border px-4 py-2 whitespace-nowrap">
                                          {student.student_id}
                                        </td>
                                        <td className="border px-4 py-2 whitespace-nowrap">
                                          {student.name}
                                        </td>
                                        
                                  
                                        
                                        <td className="border px-4 py-2 whitespace-nowrap text-center">
                                          <button
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                            onClick={() => generateCertificatePdf(student)}
                                          >
                                            Generate Certificate
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
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
