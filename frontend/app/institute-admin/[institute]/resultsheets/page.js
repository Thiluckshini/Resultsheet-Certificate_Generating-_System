'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminSidebar from '../../../../components/InstituteAdminSidebar';
import AdminTopbar from '../../../../components/InstituteAdminTopbar';

export default function AdminResultsheetsPage({ instituteKey }) {
  const { institute: encodedInstitute } = useParams();
  const [decodedInstitute, setDecodedInstitute] = useState('');
  const [studentsByInstitute, setStudentsByInstitute] = useState({});
  const [subjectsGrouped, setSubjectsGrouped] = useState({});
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

  // Fetch students, subjects, and marks once instituteKey and decodedInstitute ready
  useEffect(() => {
    if (!decodedInstitute) return;

    async function fetchData() {
      try {
        // Fetch all data
        const [studRes, subjRes, marksRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/students/by-institute?institute=${encodeURIComponent(
              decodedInstitute
            )}`
          ),
          fetch(`http://localhost:5000/api/subjects/by-institute/${encodedInstitute}`),
          fetch('http://localhost:5000/api/marks/all'),
        ]);

        if (!studRes.ok || !subjRes.ok || !marksRes.ok)
          throw new Error('Failed to fetch data');

        const [studData, subjData, marksData] = await Promise.all([
          studRes.json(),
          subjRes.json(),
          marksRes.json(),
        ]);

        // Filter students for this instituteKey (normalized)
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

        // Filter and group subjects by department and semester
        const filteredSubjects = subjData.filter(
          (subj) => normalizeKey(subj.institute) === normalizeKey(decodedInstitute)
        );

        const groupedSubjects = {};
        filteredSubjects.forEach((subj) => {
          const deptKey = normalizeKey(subj.department);
          const semKey = subj.semester || 'Unknown Semester';

          if (!groupedSubjects[deptKey]) groupedSubjects[deptKey] = {};
          if (!groupedSubjects[deptKey][semKey]) groupedSubjects[deptKey][semKey] = [];

          groupedSubjects[deptKey][semKey].push(subj);
        });
        setSubjectsGrouped(groupedSubjects);

        // Map marks by student_id and subject_id
        const marksMapTemp = {};
        marksData.forEach(({ student_id, subject_id, marks }) => {
          const idKey = student_id?.toString().trim();
          if (!marksMapTemp[idKey]) marksMapTemp[idKey] = {};
          marksMapTemp[idKey][subject_id] = marks;
        });
        setMarksMap(marksMapTemp);
      } catch (err) {
        console.error(err);
        alert('Error fetching data.');
      }
    }
    fetchData();
  }, [decodedInstitute, encodedInstitute]);

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

  // GPA and Grade helpers
  const getGradeAndGpa = (mark) => {
    if (mark >= 90) return { grade: 'A+', gpa: 4.0 };
    if (mark >= 80) return { grade: 'A', gpa: 3.7 };
    if (mark >= 70) return { grade: 'B', gpa: 3.0 };
    if (mark >= 60) return { grade: 'C', gpa: 2.0 };
    if (mark >= 50) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  };

  const calculateSemesterGpa = (studentId, subjects) => {
    let totalCredits = 0;
    let totalWeightedGpa = 0;

    subjects.forEach((subj) => {
      const mark = marksMap?.[studentId]?.[subj.id];
      if (mark === undefined || mark === null) return;
      const { gpa } = getGradeAndGpa(Number(mark));
      totalWeightedGpa += gpa * subj.credits;
      totalCredits += subj.credits;
    });

    return totalCredits > 0 ? (totalWeightedGpa / totalCredits).toFixed(2) : null;
  };

  // Generate PDF for a student
  const generatePdf = (student) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Page border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Resultsheet - ${student.name}`, pageWidth / 2, 20, { align: 'center' });
  
    // Student details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Student ID: ${student.student_id}`, 14, 30);
    doc.text(`Institute: ${student.institute}`, 14, 38);
    doc.text(`Department: ${student.department}`, 14, 46);
    doc.text(`Batch: ${student.batch}`, 14, 54);
    doc.text(`Year: ${student.year}`, 14, 62);
  
    // Subject data
    const deptKey = normalizeKey(student.department);
    const deptSubjects = subjectsGrouped[deptKey] || {};
    const allSubjects = Object.values(deptSubjects).flat();
  
    const tableData = allSubjects.map((subj) => {
      const mark = marksMap?.[student.student_id]?.[subj.id] ?? '-';
      const grade = mark !== '-' ? getGradeAndGpa(Number(mark)).grade : '-';
      return [
        subj.subject_code,
        subj.subject_name,
        subj.credits,
        mark,
        grade,
      ];
    });
  
    doc.autoTable({
      startY: 70,
      head: [['Code', 'Subject', 'Credits', 'Marks', 'Grade']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: 'bold',
        lineColor: 0,
        lineWidth: 0.3,
      },
      styles: {
        fontSize: 11,
        cellPadding: 3,
        lineColor: 0,
        lineWidth: 0.2,
      },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      margin: { left: 14, right: 14 },
    });
  
    // GPA section
    const finalY = doc.lastAutoTable.finalY || 70;
    const gpa = calculateSemesterGpa(student.student_id, allSubjects);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text(`Semester GPA: ${gpa ?? 'N/A'}`, 14, finalY + 10);
  
    // Footer
    const today = new Date().toLocaleDateString();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date Issued: ${today}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
  
    doc.save(`${student.name}_results.pdf`);
  };
  

  // Edit and Delete handlers
  const handleEdit = (student) => {
    window.location.href = `/admin/results/edit/${student.student_id || student.id}`;
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete all marks for ${student.name}?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/marks/student/${student.student_id || student.id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete marks');
      alert(`Marks deleted for ${student.name}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error deleting marks.');
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Resultsheets for Institute: {formatName(decodedInstitute)}
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
                      const deptSubjects = subjectsGrouped[deptKey] || {};
                      const allSubjects = Object.values(deptSubjects).flat();

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
                                  {students.map((student) => (
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
                                      
                                      <td className="border px-4 py-2 whitespace-nowrap">
                                        <button
                                          onClick={() => generatePdf(student)}
                                          className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                          aria-label={`Generate PDF for ${student.name}`}
                                        >
                                          View Resultsheet
                                        </button>
                                        
                                      </td>
                                    </tr>
                                  ))}
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
