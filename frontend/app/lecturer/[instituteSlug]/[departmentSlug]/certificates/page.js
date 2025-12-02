'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import jsPDF from 'jspdf';
import { FaSearch } from 'react-icons/fa';  
import LecturerSidebar from '@/components/LecturerSidebar';
import LecturerTopbar from '@/components/LecturerTopbar';

export default function CertificatesPage() {
  const { instituteSlug, departmentSlug } = useParams();
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [subjectsBySemester, setSubjectsBySemester] = useState({});
  const [savedMarks, setSavedMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedYears, setExpandedYears] = useState({});

  const capitalizeWords = (str) =>
    str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

      function toggleYear(year) {
        setExpandedYears((prev) => ({
          ...prev,
          [year]: !prev[year],
        }));
      }

      const filteredStudents = students.filter((student) => {
        const query = searchQuery.toLowerCase();
        return (
          student.name.toLowerCase().includes(query) ||
          student.student_id.toLowerCase().includes(query)
        );
      });

      const studentsByYear = filteredStudents.reduce((acc, student) => {
        const year = student.year || 'Unknown'; // Adjust key if needed
        if (!acc[year]) acc[year] = [];
        acc[year].push(student);
        return acc;
      }, {});

  useEffect(() => {
    const lecturer = JSON.parse(sessionStorage.getItem('lecturer') || '{}');
    if (!lecturer?.id) {
      router.push('/lecturer/login');
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
      const data = await res.json();

      const marksMap = {};
      data.forEach(({ student_id, subject_id, marks }) => {
        if (!marksMap[student_id]) marksMap[student_id] = {};
        marksMap[student_id][subject_id] = marks.toString();
      });

      setSavedMarks(marksMap);
    } catch (err) {
      console.error(err);
    }
  }

  function getGradeAndGpa(mark) {
    if (mark >= 90) return { grade: 'A+', gpa: 4.0 };
    if (mark >= 80) return { grade: 'A', gpa: 3.7 };
    if (mark >= 70) return { grade: 'B', gpa: 3.0 };
    if (mark >= 60) return { grade: 'C', gpa: 2.0 };
    if (mark >= 50) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  }

  function calculateOverallGpa(studentId) {
    let totalPoints = 0;
    let totalCredits = 0;

    Object.values(subjectsBySemester).forEach((subjects) => {
      subjects.forEach((subj) => {
        const markStr = savedMarks[studentId]?.[subj.id];
        if (!markStr) return;

        const marks = Number(markStr);
        if (isNaN(marks)) return;

        const { gpa } = getGradeAndGpa(marks);
        totalPoints += gpa * subj.credits;
        totalCredits += subj.credits;
      });
    });

    if (totalCredits === 0) return 0;
    return totalPoints / totalCredits;
  }

  function getClassification(gpa) {
    if (gpa >= 3.7) return 'First Class';
    if (gpa >= 3.0) return 'Second Class Upper';
    if (gpa >= 2.0) return 'Second Class Lower';
    if (gpa >= 1.0) return 'Third Class';
    return 'Fail';
  }

  function generateCertificate(student, action = 'download') {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  
    const gpa = calculateOverallGpa(student.id);
    const classification = getClassification(gpa);
  
    const instituteName = capitalizeWords(instituteSlug);
    const departmentName = capitalizeWords(departmentSlug);
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Borders
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(4);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(1);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28);
  
    // Certificate content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Certificate of Completion', pageWidth / 2, 50, { align: 'center' });
  
    doc.setFontSize(16);
    doc.setFont('times', 'normal');
    doc.text(`This is to certify that`, pageWidth / 2, 70, { align: 'center' });
  
    doc.setFontSize(20);
    doc.setFont('times', 'bolditalic');
    doc.text(`${student.name}`, pageWidth / 2, 85, { align: 'center' });
  
    doc.setFontSize(16);
    doc.setFont('times', 'normal');
    doc.text(`has successfully completed the program in`, pageWidth / 2, 100, { align: 'center' });
  
    doc.setFont('times', 'bold');
    doc.text(`${departmentName}`, pageWidth / 2, 110, { align: 'center' });
  
    doc.setFont('times', 'normal');
    doc.text(`at ${instituteName} with a GPA of ${gpa.toFixed(2)} (${classification}).`, pageWidth / 2, 125, { align: 'center' });
  
    doc.setFontSize(14);
    doc.text(`Student ID: ${student.student_id}`, pageWidth / 2, 145, { align: 'center' });
  
    doc.setFontSize(12);
    doc.line(pageWidth / 2 - 40, pageHeight - 40, pageWidth / 2 + 40, pageHeight - 40);
    doc.text('Authorized Signature', pageWidth / 2, pageHeight - 35, { align: 'center' });
  
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Date Issued: ${today}`, pageWidth - 30, pageHeight - 15, {
      align: 'right',
    });
  
    // Save or View PDF
    if (action === 'view') {
      window.open(doc.output('bloburl'), '_blank');
    } else {
      doc.save(`Certificate_${student.student_id}.pdf`);
    }
  }
  
  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <LecturerSidebar />
      <div className="flex-1">
        <LecturerTopbar />
        <main className="ml-64 mt-16 p-6 bg-gray-200 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Certificates - {capitalizeWords(instituteSlug)} / {capitalizeWords(departmentSlug)}
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
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
              {studentsInYear.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{student.student_id}</td>
                    <td className="border px-4 py-2">{student.name}</td>
                    <td className="border px-4 py-2 text-center">
                    <button
    onClick={() => generateCertificate(student, 'view')}
    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
  >
    View Certificate
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

