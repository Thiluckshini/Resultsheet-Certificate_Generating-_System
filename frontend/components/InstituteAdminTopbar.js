"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { FaUsers, FaCrown, FaPhoneAlt, FaCogs, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

export default function InstituteAdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract the institute slug from the URL path
  // Assuming URL structure: /institute-admin/[institute]/somepage
  const pathParts = pathname.split("/");
  const institute = pathParts[2] || ""; // index 0 = '', 1 = 'institute-admin', 2 = [institute]

  const handleLogout = () => {
    // Your logout logic here
    router.push("/");
  };

  return (
    <div className="bg-gray-900 text-white w-full fixed top-0 left-0 flex justify-between items-center px-6 py-2 z-50">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="EduCertify Logo"
            width={70}
            height={15}
            className="object-contain"
          />
        </Link>
      </div>

      <div className="flex space-x-6 items-center">
        <Link
          href={`/institute-admin/${institute}/profile`}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2"
        >
          <FaUsers size={20} />
        </Link>

        <Link
          href={`/institute-admin/admin-profile`}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2"
        >
          <FaCrown size={20} />
        </Link>

        <Link
          href={`/institute-admin/admin-contact`}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2"
        >
          <FaPhoneAlt size={20} />
        </Link>

        <Link
          href={`/institute-admin/settings`}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2"
        >
          <FaCogs size={20} />
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 px-3 py-3 rounded text-white flex items-center space-x-2"
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>
    </div>
  );
}
