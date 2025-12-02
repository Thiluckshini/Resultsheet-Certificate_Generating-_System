"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaFileSignature,
  FaUserTie,
  FaChalkboard,
  FaUsers,
  FaBookOpen,
  FaAward,
  FaCertificate,
  FaBuilding, // <-- New icon for departments
} from "react-icons/fa";

export default function InstituteAdminSidebar() {
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedInstitute =
      typeof window !== "undefined"
        ? sessionStorage.getItem("institute")
        : null;

    if (!storedInstitute) {
      setTimeout(() => {
        router.push("/institute-admin/login");
      }, 1500);
    } else {
      setInstitute(storedInstitute);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="text-white p-4">Loading menu...</div>;
  }

  if (!institute) {
    return (
      <div className="text-white p-4">
        No institute found. Redirecting to login...
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-900 text-white h-screen pt-20 fixed z-50">
      <ul className="space-y-4 p-4">
  {[
    ["Dashboard", "dashboard", FaTachometerAlt],   
    ["Departments", "departments", FaBuilding], 
    ["Lecturers", "lecturers", FaUserTie],
    ["Students", "students", FaUsers],// <--- before Courses
    ["Courses", "courses", FaChalkboard],
    ["Subjects", "subjects", FaBookOpen],
    ["Result Sheets", "resultsheets", FaCertificate],
    ["Certificates", "certificates", FaAward],
  ].map(([label, path, Icon]) => (
    <li key={path}>
      <Link href={`/institute-admin/${institute}/${path}`}>
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
