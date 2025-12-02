'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminSidebar from '../../../../../components/LecturerSidebar';
import AdminTopbar from '../../../../../components/LecturerTopbar';

export default function LecturerSubjectsPage() {
  const { instituteSlug, departmentSlug } = useParams();

  const [subjectsBySemester, setSubjectsBySemester] = useState({});
  const formatName = (str) =>
    str
      ?.toLowerCase()
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  useEffect(() => {
    fetchSubjects();
  }, [instituteSlug, departmentSlug]);

  const fetchSubjects = async () => {
    try {
      // Filter on backend by institute and department via query params
      const res = await fetch(
        `http://localhost:5000/api/subjects?institute=${instituteSlug}&department=${departmentSlug}`
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Group subjects by semester
      const grouped = data.reduce((acc, subj) => {
        acc[subj.semester] = acc[subj.semester] || [];
        acc[subj.semester].push(subj);
        return acc;
      }, {});
      setSubjectsBySemester(grouped);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      alert('Error fetching subjects');
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Subjects - {formatName(instituteSlug)} / {formatName(departmentSlug)}
          </h1>

          {Object.keys(subjectsBySemester).length === 0 ? (
            <p>No subjects found for this department.</p>
          ) : (
            Object.entries(subjectsBySemester).map(([semester, subjects]) => (
              <div key={semester} className="mb-6 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Semester {semester}</h2>
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Code</th>
                      <th className="border px-4 py-2">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id}>
                        <td className="border px-4 py-2">{subject.name}</td>
                        <td className="border px-4 py-2">{subject.code}</td>
                        <td className="border px-4 py-2">{subject.credits}</td>
                       
                           
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
