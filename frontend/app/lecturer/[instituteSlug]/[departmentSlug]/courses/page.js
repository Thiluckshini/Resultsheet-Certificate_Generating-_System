'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminSidebar from '../../../../../components/LecturerSidebar';
import AdminTopbar from '../../../../../components/LecturerTopbar';

export default function CoursesPage() {
  const { instituteSlug, departmentSlug } = useParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Converts slug like 'computer-science' => 'Computer Science'
  const slugToTitle = (slug) =>
    slug
      ?.split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);

        const instituteName = slugToTitle(instituteSlug);
        const departmentName = slugToTitle(departmentSlug);

        const encodedInstitute = encodeURIComponent(instituteName);
        const encodedDepartment = encodeURIComponent(departmentName);

        // Backend expects query params institute and department (names, not ids)
        const res = await fetch(`http://localhost:5000/api/courses/by-institute/${encodedInstitute}`);

        if (!res.ok) throw new Error('Failed to fetch courses');

        const data = await res.json();

        // Assuming API returns an array directly
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (instituteSlug && departmentSlug) {
      fetchCourses();
    }
  }, [instituteSlug, departmentSlug]);

  if (loading) return <p className="p-6">Loading courses...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (courses.length === 0) return <p className="p-6">No courses found.</p>;

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Courses - {slugToTitle(instituteSlug)} / {slugToTitle(departmentSlug)}
          </h1>

          {/* Courses Table */}
          <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Course Name</th>
                <th className="border px-4 py-2 text-left">Code</th>
                <th className="border px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{course.name}</td>
                  <td className="border px-4 py-2">{course.course_code || '-'}</td>
                  <td className="border px-4 py-2">{course.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
