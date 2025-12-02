'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';

export default function AdminResultsheetsPage() {
  const [studentsByInstitute, setStudentsByInstitute] = useState({});
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [expandedInstitutes, setExpandedInstitutes] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [expandedYears, setExpandedYears] = useState({});
  const [subjectsGrouped, setSubjectsGrouped] = useState({});
  const [marksMap, setMarksMap] = useState({});

  const capitalizeWords = (str) =>
    str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

      

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
        const [instRes, studRes, subjRes, marksRes] = await Promise.all([
          fetch('http://localhost:5000/api/institutes'),
          fetch('http://localhost:5000/api/students'),
          fetch('http://localhost:5000/api/subjects/all'),
          fetch('http://localhost:5000/api/marks/all'),
        ]);

        if (!instRes.ok || !studRes.ok || !subjRes.ok || !marksRes.ok)
          throw new Error('Failed to fetch data');

        const [instData, studData, subjData, marksData] = await Promise.all([
          instRes.json(),
          studRes.json(),
          subjRes.json(),
          marksRes.json(),
        ]);

        setAllInstitutes(instData);

        const groupedStudents = {};
        studData.forEach((student) => {
          const instKey = normalizeKey(student.institute);
          const deptKey = normalizeKey(student.department);
          const yearKey = student.year || 'Unknown Year';

          if (!groupedStudents[instKey]) {
            groupedStudents[instKey] = { displayName: student.institute, departments: {} };
          }
          if (!groupedStudents[instKey].departments[deptKey]) {
            groupedStudents[instKey].departments[deptKey] = { displayName: student.department, years: {} };
          }
          if (!groupedStudents[instKey].departments[deptKey].years[yearKey]) {
            groupedStudents[instKey].departments[deptKey].years[yearKey] = [];
          }
          groupedStudents[instKey].departments[deptKey].years[yearKey].push(student);
        });
        setStudentsByInstitute(groupedStudents);

        const groupedSubjects = {};
        subjData.forEach((subj) => {
          const instKey = normalizeKey(subj.institute);
          const deptKey = normalizeKey(subj.department);
          const semKey = subj.semester || 'Unknown Semester';

          if (!groupedSubjects[instKey]) groupedSubjects[instKey] = {};
          if (!groupedSubjects[instKey][deptKey]) groupedSubjects[instKey][deptKey] = {};
          if (!groupedSubjects[instKey][deptKey][semKey]) groupedSubjects[instKey][deptKey][semKey] = [];

          groupedSubjects[instKey][deptKey][semKey].push(subj);
        });
        setSubjectsGrouped(groupedSubjects);

        const marksMapTemp = {};
        marksData.forEach(({ student_id, subject_id, marks }) => {
          const idKey = student_id?.toString().trim(); // Ensure it's a clean string key
          if (!marksMapTemp[idKey]) marksMapTemp[idKey] = {};
          marksMapTemp[idKey][subject_id] = marks;
        });
        
        setMarksMap(marksMapTemp);
      } catch (err) {
        console.error(err);
        alert('Error fetching data.');
        console.log('Fetched marks:', marksData);
        console.log('Grouped students:', groupedStudents);
        console.log('Grouped subjects:', groupedSubjects);
      }
    }
    fetchData();
  }, []);

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

  const toggleYear = (instKey, deptKey, yearKey) => {
    setExpandedYears((prev) => ({
      ...prev,
      [instKey]: {
        ...prev[instKey],
        [deptKey]: {
          ...prev[instKey]?.[deptKey],
          [yearKey]: !prev[instKey]?.[deptKey]?.[yearKey],
        },
      },
    }));
  };

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
   
  function generatePdf(student, instKey, deptKey) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
    const instituteName = formatName(studentsByInstitute[instKey]?.displayName || instKey);
    const departmentName = formatName(studentsByInstitute[instKey]?.departments[deptKey]?.displayName || deptKey);
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Draw thin border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(instituteName, pageWidth / 2, 25, { align: 'center' });
  
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Department: ${departmentName}`, pageWidth / 2, 33, { align: 'center' });
  
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(10, 38, pageWidth - 10, 38);
  
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Resultsheet', pageWidth / 2, 48, { align: 'center' });
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student: ${student.name} (${student.student_id || student.id})`, pageWidth / 2, 56, { align: 'center' });
  
    let yOffset = 65;
  
    // Extract subjects grouped by semester for this institute and department
    const subjectsBySemester = subjectsGrouped[instKey]?.[deptKey] || {};
  
    Object.entries(subjectsBySemester).forEach(([semester, subjects], index) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Semester ${semester}`, 14, yOffset);
      yOffset += 8;
  
      const tableColumn = ['Subject Name', 'Subject Code', 'Marks', 'Grade'];
      const tableRows = [];
  
      subjects.forEach((subj) => {
        const mark = marksMap?.[student.student_id || student.id]?.[subj.id];
        const { grade } = mark !== undefined && mark !== null ? getGradeAndGpa(Number(mark)) : { grade: '—' };
        const markDisplay = mark !== undefined && mark !== null ? mark : '—';
  
        tableRows.push([subj.name, subj.code, markDisplay, grade]);
      });
  
      doc.autoTable({
        startY: yOffset,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: 0 },
        styles: { fontSize: 11, cellPadding: 3, lineWidth: 0.3, lineColor: 0 },
        margin: { left: 14, right: 14 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
  
      yOffset = doc.lastAutoTable.finalY + 6;
  
      const gpa = calculateSemesterGpa(student.student_id || student.id, subjects);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(0, 0, 0);
      doc.text(`Semester GPA: ${gpa || 'N/A'}`, 14, yOffset);
  
      yOffset += 14;
  
      if (yOffset > pageHeight - 30 && index < Object.entries(subjectsBySemester).length - 1) {
        doc.addPage();
        yOffset = 20;
  
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      }
    });
  
    // Footer
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date Issued: ${today}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
  
    doc.save(`Resultsheet_${student.student_id || student.id}.pdf`);
  }
  
  
  const handleEdit = (student) => {
    window.location.href = `/admin/results/edit/${student.student_id || student.id}`;
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`Are you sure you want to delete all marks for ${student.name}?`);
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
          <h1 className="text-3xl font-bold mb-6">Resultsheets by Institute</h1>
          {allInstitutes.length === 0 && <p className="italic text-gray-500">No institutes available.</p>}
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
                  {expandedInstitutes[instKey] ? '▼' : '▶'} {formatName(inst.name)}
                </button>

                {isInstExpanded && (
                  <div className="bg-white p-4 rounded shadow-md">
                    {Object.entries(departments).map(([deptKey, deptData]) => {
                      const isDeptExpanded = expandedDepartments[instKey]?.[deptKey] || false;
                      const years = deptData.years;

                      return (
                        <div key={deptKey} className="mb-6">
                          <button
                            onClick={() => toggleDepartment(instKey, deptKey)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
                          >
                            {expandedDepartments[instKey]?.[deptKey] ? '▼' : '▶'} Department: {formatName(deptData.displayName)}
                          </button>

                          {isDeptExpanded && (
                            <div className="bg-white p-4 rounded shadow">
                              {Object.entries(years).map(([year, students]) => {
                                const isYearExpanded = expandedYears[instKey]?.[deptKey]?.[year] || false;
                                const deptSubjects = subjectsGrouped[instKey]?.[deptKey] || {};
                                const allSubjects = Object.values(deptSubjects).flat();

                                return (
                                  <div key={year} className="mb-6">
                                    <button
                                      onClick={() => toggleYear(instKey, deptKey, year)}
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
                                              <th className="border px-4 py-2">Email</th>
                                              
                                             
                                              <th className="border px-4 py-2">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {students.map((student) => (
                                              <tr key={student.student_id || student.id} className="even:bg-gray-50">
                                                <td className="border px-4 py-2">{student.student_id || student.id}</td>
                                                <td className="border px-4 py-2">{student.name}</td>
                                                <td className="border px-4 py-2">{student.email || '—'}</td>
                                              
                                                <td className="border px-4 py-2 text-center">
                                                <button
  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
  onClick={() => generatePdf(student, instKey, deptKey)}
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
