'use client';

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
  FaAward,
} from "react-icons/fa";

export default function StudentSidebar() {
  const [instituteSlug, setInstituteSlug] = useState(null);
  const [departmentSlug, setDepartmentSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedStudent = sessionStorage.getItem("student");

    if (!storedStudent) {
      router.push("/student/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedStudent);
      if (parsed.institute_slug && parsed.department_slug) {
        setInstituteSlug(parsed.institute_slug);
        setDepartmentSlug(parsed.department_slug);
      } else {
        router.push("/student/login");
      }
    } catch (e) {
      console.error("Invalid student session:", e);
      router.push("/student/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="text-white p-4">Loading menu...</div>;
  if (!instituteSlug || !departmentSlug) return <div className="text-white p-4">Redirecting...</div>;

  const basePath = `/student/${instituteSlug}/${departmentSlug}`;

  const menuItems = [
    ["Dashboard", "dashboard", FaTachometerAlt],
    ["Result Sheet", "resultsheets", FaCertificate],
    ["Certificate", "certificates", FaAward],
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen pt-20 fixed z-50">
      <ul className="space-y-4 p-4">
        {menuItems.map(([label, path, Icon]) => (
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
