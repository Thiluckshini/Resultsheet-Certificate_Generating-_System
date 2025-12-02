'use client';

import LecturerSidebar from '@/components/LecturerSidebar';
import LecturerTopbar from '@/components/LecturerTopbar';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Convert slug to title case
function toTitleCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Card Component
function DashboardCard({ title, count }) {
  return (
    <div className="bg-white p-4 rounded shadow-md text-left">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold text-indigo-600">{count}</p>
    </div>
  );
}

export default function LecturerDashboard() {
  const { instituteSlug, departmentSlug } = useParams();
  const router = useRouter();
  const [lecturer, setLecturer] = useState(null);
  const [metrics, setMetrics] = useState({
    students: 0,
    departments: 0,
    courses: 0,
    subjects: 0,
  });

  const instituteName = toTitleCase(decodeURIComponent(instituteSlug));
  const departmentName = toTitleCase(decodeURIComponent(departmentSlug));

  useEffect(() => {
    const stored = sessionStorage.getItem('lecturer');
    if (!stored) {
      router.push('/lecturer/login');
    } else {
      const parsed = JSON.parse(stored);
      setLecturer(parsed);
      fetchData(parsed);
    }
  }, [router]);

  const fetchData = async (lecturer) => {
    const { token, institute_id, department_id } = lecturer;

    const fetchWithToken = async (url, label) => {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const res = await fetch(url, { headers });
        const text = await res.text();
        if (!res.ok) {
          console.error(`${label} API Error:`, res.status, text);
          throw new Error(`${label} API responded with status ${res.status}`);
        }
        return JSON.parse(text);
      } catch (err) {
        console.error(`Error fetching ${label}:`, err.message);
        return null;
      }
    };

    const [students, departments, courses, subjects] = await Promise.all([
      // Correct calls (keep these as-is)
fetchWithToken(`http://localhost:5000/api/students?institute_id=${institute_id}&department_id=${department_id}`, "Students"),
fetchWithToken(`http://localhost:5000/api/departments?institute_id=${institute_id}`, "Departments"),
fetchWithToken(`http://localhost:5000/api/courses?institute_id=${institute_id}&department_id=${department_id}`, "Courses"),

      fetchWithToken(`http://localhost:5000/api/subjects?institute=${instituteSlug}&department=${departmentSlug}`, "Subjects"),

    ]);

    const getLength = (res) => Array.isArray(res) ? res.length : (res?.data?.length || 0);

    setMetrics({
      students: getLength(students),
      departments: getLength(departments),
      courses: getLength(courses),
      subjects: getLength(subjects),
    });
  };

  return (
    <div className="flex h-screen">
      <LecturerSidebar />
      <div className="flex-1">
        <LecturerTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">{instituteName} - Lecturer Dashboard</h1>
          </div>
          <div className="mb-6">
          <h2 className="text-2xl font-bold">Welcome to the <span className="text-blue-600 font-bold">{departmentName}</span> department's lecturer dashboard <span className="text-blue-600 font-bold">{lecturer?.name}!</span></h2>
          <p className="text-lg mb-4 text-gray-700">
            Here you can manage your department students & marks. Also you can view your institute's departments, courses, subjects, and more.
          </p>
          </div>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Total Students" count={metrics.students} />
            <DashboardCard title="Total Departments" count={metrics.departments} />
            <DashboardCard title="Total Courses" count={metrics.courses} />
            <DashboardCard title="Total Subjects" count={metrics.subjects} />
          </div>
        </div>
      </div>
    </div>
  );
}
