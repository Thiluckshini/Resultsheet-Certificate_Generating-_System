import Link from "next/link";
import { useRouter, useParams } from "next/navigation"; 
import { FaUsers, FaCrown, FaPhoneAlt, FaSignOutAlt, FaCogs } from "react-icons/fa"; 
import Image from "next/image";

export default function StudentTopbar() {
  const router = useRouter();
  const { instituteSlug, departmentSlug } = useParams(); // <-- import added

  // Logout Function
  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/"); 
  };

  return (
    <div className="bg-gray-900 text-white w-full fixed top-0 left-0 flex justify-between items-center px-6 py-0 z-50">
      {/* Logo on the left with controlled height */}
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
        {/* Student Profile Button with Icon */}
        <Link
          href={`/student/${instituteSlug}/${departmentSlug}/profile`}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2"
        >
          <FaUsers size={20} />
        </Link>

        {/* Admin Profile Button with Icon */}
        <Link href="/student/admin-profile" className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2">
          <FaCrown size={20} />
        </Link>

        {/* Admin Contact Button with Phone Icon */}
        <Link href="/student/admin-contact" className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2">
          <FaPhoneAlt size={20} />
        </Link>

        {/* Settings Button with Settings Icon */}
        <Link href="/student/settings" className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2">
          <FaCogs size={20} />
        </Link>

        {/* Logout Button with Icon */}
        <button
          className="bg-red-500 hover:bg-red-700 px-3 py-3 rounded text-white flex items-center space-x-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>
    </div>
  );
}
