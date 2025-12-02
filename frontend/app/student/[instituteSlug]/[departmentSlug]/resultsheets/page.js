'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaSearch } from 'react-icons/fa';       
import StudentSidebar from '@/components/StudentSidebar';
import StudentTopbar from '@/components/StudentTopbar';

export default function ResultsheetsPage() {
  const { instituteSlug, departmentSlug } = useParams();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [subjectsBySemester, setSubjectsBySemester] = useState({});
  const [savedMarks, setSavedMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedYears, setExpandedYears] = useState({});


  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.student_id.toLowerCase().includes(query)
    );
  });

  function toggleYear(year) {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  }

  const studentsByYear = filteredStudents.reduce((acc, student) => {
    const year = student.year || 'Unknown'; // Adjust key if needed
    if (!acc[year]) acc[year] = [];
    acc[year].push(student);
    return acc;
  }, {});
  
  
  const capitalizeWords = (str) =>
    str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');


      

  useEffect(() => {
    const student = JSON.parse(sessionStorage.getItem('student') || '{}');
    if (!student?.id) {
      router.push('/student/login');
      return;
    }

  async function fetchAllData() {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchSubjects(), fetchMarks()]);
      setLoading(false);
    }

    fetchAllData();
  }, [instituteSlug, departmentSlug]);

  async function fetchStudents() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students/by-institute-department?institute=${instituteSlug}&department=${departmentSlug}`
      );
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchSubjects() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/subjects?institute=${instituteSlug}&department=${departmentSlug}`
      );
      if (!res.ok) throw new Error('Failed to fetch subjects');
      const data = await res.json();

      const grouped = data.reduce((acc, subj) => {
        acc[subj.semester] = acc[subj.semester] || [];
        acc[subj.semester].push(subj);
        return acc;
      }, {});
      setSubjectsBySemester(grouped);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMarks() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/marks/by-institute-department?institute=${instituteSlug}&department=${departmentSlug}`
      );
      if (!res.ok) throw new Error('Failed to fetch marks');
      const data = await res.json();

      const marksMap = {};
      data.forEach(({ student_id, subject_id, marks }) => {
        if (!marksMap[student_id]) marksMap[student_id] = {};
        marksMap[student_id][subject_id] = marks.toString();
      });

      setSavedMarks(marksMap);
    } catch (err) {
      console.error('Error fetching marks:', err);
    }
  }

  // Grade helper
  function getGradeAndGpa(mark) {
    if (mark >= 90) return { grade: 'A+', gpa: 4.0 };
    if (mark >= 80) return { grade: 'A', gpa: 3.7 };
    if (mark >= 70) return { grade: 'B', gpa: 3.0 };
    if (mark >= 60) return { grade: 'C', gpa: 2.0 };
    if (mark >= 50) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  }

  // GPA calculation for semester
  function calculateSemesterGpa(studentId, subjects) {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach((subj) => {
      const marksStr = savedMarks[studentId]?.[subj.id];
      if (!marksStr) return;

      const marks = Number(marksStr);
      if (isNaN(marks)) return;

      const { gpa } = getGradeAndGpa(marks);
      totalPoints += gpa * subj.credits;
      totalCredits += subj.credits;
    });

    if (totalCredits === 0) return '0.00';
    return (totalPoints / totalCredits).toFixed(2);
  }

  function generatePdfBlob(student) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
    const instituteName = capitalizeWords(instituteSlug);
    const departmentName = capitalizeWords(departmentSlug);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(instituteName, pageWidth / 2, 25, { align: 'center' });
  
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Department: ${departmentName}`, pageWidth / 2, 33, { align: 'center' });
  
    doc.setLineWidth(0.3);
    doc.line(10, 38, pageWidth - 10, 38);
  
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Resultsheet', pageWidth / 2, 48, { align: 'center' });
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student: ${student.name} (${student.student_id})`, pageWidth / 2, 56, { align: 'center' });
  
    let yOffset = 65;
  
    Object.entries(subjectsBySemester).forEach(([semester, subjects], index) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Semester ${semester}`, 14, yOffset);
      yOffset += 8;
  
      const tableColumn = ['Subject Name', 'Subject Code', 'Marks', 'Grade'];
      const tableRows = [];
  
      subjects.forEach((subj) => {
        const markStr = savedMarks[student.id]?.[subj.id];
        const mark = markStr !== undefined ? Number(markStr) : null;
        const { grade } = mark !== null ? getGradeAndGpa(mark) : { grade: '—' };
  
        tableRows.push([subj.name, subj.code, markStr ?? '—', grade]);
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
  
      const gpa = calculateSemesterGpa(student.id, subjects);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(0, 0, 0);
      doc.text(`Semester GPA: ${gpa}`, 14, yOffset);
      yOffset += 14;
  
      if (yOffset > pageHeight - 30 && index < Object.entries(subjectsBySemester).length - 1) {
        doc.addPage();
        yOffset = 20;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      }
    });
  
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date Issued: ${today}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
  
    return doc.output('blob');
  }
  

  // PDF generation
  function generatePdf(student) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
    const instituteName = capitalizeWords(instituteSlug);
    const departmentName = capitalizeWords(departmentSlug);
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // === Draw thin black border around page ===
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
    // === Header ===
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(instituteName, pageWidth / 2, 25, { align: 'center' });
  
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Department: ${departmentName}`, pageWidth / 2, 33, { align: 'center' });
  
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(10, 38, pageWidth - 10, 38); // horizontal line under header
  
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Resultsheet', pageWidth / 2, 48, { align: 'center' });
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student: ${student.name} (${student.student_id})`, pageWidth / 2, 56, { align: 'center' });
  
    let yOffset = 65;
  
    // === Table and semester info ===
    Object.entries(subjectsBySemester).forEach(([semester, subjects], index) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Semester ${semester}`, 14, yOffset);
      yOffset += 8;
  
      // Prepare table data
      const tableColumn = ['Subject Name', 'Subject Code', 'Marks', 'Grade'];
      const tableRows = [];
  
      subjects.forEach((subj) => {
        const markStr = savedMarks[student.id]?.[subj.id];
        const mark = markStr !== undefined ? Number(markStr) : null;
        const { grade } = mark !== null ? getGradeAndGpa(mark) : { grade: '—' };
  
        tableRows.push([subj.name, subj.code, markStr ?? '—', grade]);
      });
  
      doc.autoTable({
        startY: yOffset,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: 0 },
        styles: { fontSize: 11, cellPadding: 3, lineWidth: 0.3, lineColor: 0 },
        margin: { left: 14, right: 14 },
        alternateRowStyles: { fillColor: [245, 245, 245] }, // subtle grey alternate rows
      });
  
      yOffset = doc.lastAutoTable.finalY + 6;
  
      const gpa = calculateSemesterGpa(student.id, subjects);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(0, 0, 0);
      doc.text(`Semester GPA: ${gpa}`, 14, yOffset);
  
      yOffset += 14;
  
      if (yOffset > pageHeight - 30 && index < Object.entries(subjectsBySemester).length - 1) {
        doc.addPage();
        yOffset = 20;
  
        // Draw border on new page
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      }
    });
  
    // === Footer with date ===
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date Issued: ${today}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
  
    doc.save(`Resultsheet_${student.student_id}.pdf`);
  }
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <StudentSidebar />
      <div className="flex-1">
        <StudentTopbar />
        <main className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Resultsheets - {capitalizeWords(instituteSlug)} / {capitalizeWords(departmentSlug)}
          </h1>

          <div className="mb-4 flex justify-end items-center">
            {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 transition duration-200"
              title="Search"
            >
             <FaSearch className="text-gray-700 text-lg" />
             <span className="text-gray-700 font-medium">Search</span>
            </button>

  
  ) : (
    <div className="relative w-full md:w-1/3">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by Student ID or Name"
        className="w-full px-4 py-2 bg-white border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  )}
</div>




         
            
            {Object.entries(studentsByYear).map(([year, studentsInYear]) => (
              <div key={year} className="mb-6">
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
                >
                  {expandedYears[year] ? '▼' : '▶'} Year: {year}
                </button>
            
                {expandedYears[year] && (
                  <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white rounded shadow-md">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Student ID</th>
                        <th className="border px-4 py-2">Student Name</th>
                        <th className="border px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsInYear.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{student.student_id}</td>
                          <td className="border px-4 py-2">{student.name}</td>
                          <td className="border px-4 py-2 text-center space-x-2">
                          <button
    onClick={() => {
      const blob = generatePdfBlob(student);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }}
    className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
  >
    View Resultsheet
  </button>

  <button
    onClick={() => generatePdf(student)}
    className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm"
  >
    Download Resultsheet
  </button>
  
</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          
        </main>
      </div>
    </div>
  );
}
