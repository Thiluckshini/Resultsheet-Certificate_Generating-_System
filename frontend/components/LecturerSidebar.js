// frontend/components/LecturerSidebar.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaChalkboard,
  FaBookOpen,
  FaCertificate,
  FaFileSignature,
  FaAward,
} from "react-icons/fa";

export default function LecturerSidebar() {
  const [instituteSlug, setInstituteSlug] = useState(null);
  const [departmentSlug, setDepartmentSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLecturer = sessionStorage.getItem("lecturer");

      if (storedLecturer) {
        const { institute_slug, department_slug } = JSON.parse(storedLecturer);
        setInstituteSlug(institute_slug);
        setDepartmentSlug(department_slug);
      } else {
        router.push("/lecturer/login");
      }
    }

    setLoading(false);
  }, [router]);

  if (loading) return <div className="text-white p-4">Loading menu...</div>;
  if (!instituteSlug || !departmentSlug) return <div className="text-white p-4">Redirecting...</div>;

  const basePath = `/lecturer/${instituteSlug}/${departmentSlug}`;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen pt-20 fixed z-50">
      <ul className="space-y-4 p-4">
        {[
          ["Dashboard", "dashboard", FaTachometerAlt],
          ["Departments", "departments", FaBuilding],
          ["Students", "students", FaUsers],
          ["Courses", "courses", FaChalkboard],
          ["Subjects", "subjects", FaBookOpen],
          ["Marks", "marks", FaFileSignature],
          ["Result Sheets", "resultsheets", FaCertificate],
          ["Certificates", "certificates", FaAward],
        ].map(([label, path, Icon]) => (
          <li key={path}>
            <Link href={`${basePath}/${path}`}>
              <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
                <Icon size={20} />
                <span>{label}</span>
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
