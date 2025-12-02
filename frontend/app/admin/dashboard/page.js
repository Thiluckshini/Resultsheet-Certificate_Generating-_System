'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopbar from "../../../components/AdminTopbar";

export default function AdminDashboard() {
  const [totalInstitutes, setTotalInstitutes] = useState(0);
  const [totalInstituteAdmins, setTotalInstituteAdmins] = useState(0);
  const [totalLecturers, setTotalLecturers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Adjust as per your auth

      const fetchWithToken = async (url, label) => {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

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

      const [
        institutes,
        instituteAdmins,
        lecturers,
        students,
        departments,
        courses,
        subjects,
      ] = await Promise.all([
        fetchWithToken("http://localhost:5000/api/institutes", 'Institutes'),
        fetchWithToken("http://localhost:5000/api/institute-admins", 'Institute Admins'),
        fetchWithToken("http://localhost:5000/api/lecturers", 'Lecturers'),
        fetchWithToken("http://localhost:5000/api/students", 'Students'),
        fetchWithToken("http://localhost:5000/api/departments", 'Departments'),
        fetchWithToken("http://localhost:5000/api/courses", 'Courses'),
        fetchWithToken("http://localhost:5000/api/subjects/all", 'Subjects'),

      ]);

      if (institutes) setTotalInstitutes(institutes.length);
      if (instituteAdmins) setTotalInstituteAdmins(instituteAdmins.length);
      if (lecturers) setTotalLecturers(lecturers.length);

      if (students) setTotalStudents(students.length);
      if (departments) setTotalDepartments(departments.length);
      if (courses) setTotalCourses(courses.length);
      if (subjects) setTotalSubjects(subjects.length);
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Super Admin Dashboard</h1>
          <p className="text-black-600 text-lg font-semibold">
            Welcome to the <span className="text-blue-600 text-lg font-semibold">Super Admin</span> Dashboard! 
          </p>
          <p className="text-lg mb-4 text-gray-700">
            Manage institutes, institute admins, lecturers, students, departments, courses, subjects, and more.
          </p>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Metric title="Total Institutes" value={totalInstitutes} />
            <Metric title="Total Institute Admins" value={totalInstituteAdmins} />
            <Metric title="Total Lecturers" value={totalLecturers} />
            <Metric title="Total Students" value={totalStudents} />
            <Metric title="Total Departments" value={totalDepartments} />
            <Metric title="Total Courses" value={totalCourses} />
            <Metric title="Total Subjects" value={totalSubjects} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-blue-600 text-lg font-semibold">{value}</p>
    </div>
  );
}

