'use client';

import Link from "next/link";
import { useRouter, useParams } from "next/navigation"; // Import both useRouter and useParams
import { FaUserTie, FaCrown, FaPhoneAlt, FaSignOutAlt, FaCogs } from "react-icons/fa";
import Image from "next/image";

export default function LecturerTopbar() {
  const router = useRouter();
  const { instituteSlug, departmentSlug } = useParams();

  // Logout handler
  const handleLogout = () => {
    console.log("Logging out...");
    // Clear authentication tokens or session here if needed
    // e.g. localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="bg-gray-900 text-white w-full fixed top-0 left-0 flex justify-between items-center px-6 py-2 z-50">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="EduCertify Logo"
            width={70}
            height={20}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-6 items-center">
        {/* Lecturer Profile */}
        <Link
          href={`/lecturer/${instituteSlug}/${departmentSlug}/profile`}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center justify-center"
          aria-label="Lecturer Profile"
        >
          <FaUserTie size={20} />
        </Link>

        {/* Admin Profile */}
        <Link
          href="/lecturer/admin-profile"
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center justify-center"
          aria-label="Admin Profile"
        >
          <FaCrown size={20} />
        </Link>

        {/* Admin Contact */}
        <Link
          href="/lecturer/admin-contact"
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center justify-center"
          aria-label="Admin Contact"
        >
          <FaPhoneAlt size={20} />
        </Link>

        {/* Settings */}
        <Link
          href="/lecturer/settings"
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center justify-center"
          aria-label="Settings"
        >
          <FaCogs size={20} />
        </Link>

        {/* Logout */}
        <button
          className="bg-red-500 hover:bg-red-700 px-3 py-3 rounded flex items-center justify-center"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>
    </div>
  );
}
