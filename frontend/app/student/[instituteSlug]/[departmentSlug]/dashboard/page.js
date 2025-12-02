'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import StudentSidebar from "../../../../../components/StudentSidebar";
import StudentTopbar from "../../../../../components/StudentTopbar";

export default function StudentDashboard() {
  const router = useRouter();
  const { instituteSlug, departmentSlug } = useParams();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('student');
    if (!stored) {
      router.push('/student/login');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored student data:", e);
      router.push('/student/login');
      return;
    }

    if (
      parsed.institute_slug !== instituteSlug ||
      parsed.department_slug !== departmentSlug
    ) {
      router.push('/student/login');
      return;
    }

    setStudent(parsed);
  }, [instituteSlug, departmentSlug, router]);

  function capitalizeWords(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const friendlyDepartmentName = capitalizeWords(departmentSlug);
  const friendlyInstituteName = capitalizeWords(instituteSlug);

  return (
    <div className="flex h-screen">
      <StudentSidebar />
      <div className="flex-1">
        <StudentTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{friendlyInstituteName} - Student Dashboard</h1>
            <div className="mb-6">
          <h2 className="text-2xl font-bold">Welcome to the <span className="text-blue-600 font-bold">{friendlyDepartmentName}</span> department's student dashboard <span className="text-blue-600 font-bold">{student?.name || 'Student'}!</span></h2>
          <p className="text-lg mb-4 text-gray-700">
            Here you can view your department's resulsheets and certificate. Also you can download your acadamic resulsheet and certificate. </p>
          </div>

            <div className="grid grid-cols-3 gap-6 max-w-4xl">
              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-2 text-gray-900">Enrolled Institute</h2>
                <p className="text-gray-700 text-lg">{friendlyInstituteName}</p>
              </div>

              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-2 text-gray-900">Enrolled Department</h2>
                <p className="text-gray-700 text-lg">{friendlyDepartmentName}</p>
              </div>

              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-2 text-gray-900">Enrolled Course</h2>
                <p className="text-gray-700 text-lg">{friendlyDepartmentName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
