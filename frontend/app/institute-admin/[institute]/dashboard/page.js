'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "../../../../components/InstituteAdminSidebar";
import AdminTopbar from "../../../../components/InstituteAdminTopbar";

// Convert slug to title case
function toTitleCase(str) {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function InstituteAdminDashboard() {
  const params = useParams();
  const instituteSlug = params.institute || "";
  const instituteName = toTitleCase(decodeURIComponent(instituteSlug));

  const [totalLecturers, setTotalLecturers] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  const [institute, setInstitute] = useState({ name: "", logoUrl: "" });
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const instituteId = localStorage.getItem("institute_id");
      const storedAdminName = localStorage.getItem("admin_name") || "";

      if (!instituteId) return;

      setAdminName(storedAdminName);

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

      const [
        lecturersRes,
        departmentsRes,
        coursesRes,
        subjectsRes,
        studentsRes,
        instituteDetails,
      ] = await Promise.all([
        fetchWithToken(`http://localhost:5000/api/lecturers?institute_id=${instituteId}`, "Lecturers"),
        fetchWithToken(`http://localhost:5000/api/departments?institute_id=${instituteId}`, "Departments"),
        fetchWithToken(`http://localhost:5000/api/courses?institute_id=${instituteId}`, "Courses"),
        fetchWithToken(`http://localhost:5000/api/subjects/by-institute/${encodeURIComponent(instituteName)}`, "Subjects")
,
        fetchWithToken(`http://localhost:5000/api/students?institute_id=${instituteId}`, "Students"),
      ]);

      const getLength = (res) => Array.isArray(res) ? res.length : (res?.data?.length || 0);

      setTotalLecturers(getLength(lecturersRes));
      setTotalDepartments(getLength(departmentsRes));
      setTotalCourses(getLength(coursesRes));
      setTotalSubjects(getLength(subjectsRes));
      setTotalStudents(getLength(studentsRes));

      if (instituteDetails) {
        let rawPath = instituteDetails.logoUrl || "";
        rawPath = rawPath.replace(/\\/g, '/');
        const logoUrl = rawPath ? `http://localhost:5000/${rawPath}` : "";

        setInstitute({
          name: instituteDetails.name,
          logoUrl,
        });
      }

      const adminId = localStorage.getItem("admin_id"); // or lecturer id for lecturer dashboard

if (adminId) {
  const adminDetails = await fetchWithToken(
    `http://localhost:5000/api/admin/${adminId}`, 
    "Admin Details"
  );

  if (adminDetails && adminDetails.name) {
    setAdminName(adminDetails.name);
    localStorage.setItem("admin_name", adminDetails.name); // cache it for next time
  }
}

    };


    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar onLogout={handleLogout} />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <div className="flex items-center mb-4">
            
            <h1 className="text-3xl font-bold">
              {instituteName} - Institute Admin Dashboard
            </h1>
          </div>

          <p className="text-lg mb-4">
            Welcome, <strong>{adminName || "Admin"}</strong>! View your institute's statistics at a glance.
          </p>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Total Lecturers" count={totalLecturers} />
            <DashboardCard title="Total Departments" count={totalDepartments} />
            <DashboardCard title="Total Courses" count={totalCourses} />
            <DashboardCard title="Total Subjects" count={totalSubjects} />
            <DashboardCard title="Total Students" count={totalStudents} />
          </div>
        </div>
      </div>
    </div>
  );
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
