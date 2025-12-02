import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCrown, FaPhoneAlt, FaSignOutAlt, FaCogs } from "react-icons/fa";
import Image from "next/image"; // Import Image for the logo

export default function AdminTopbar() {
  const router = useRouter();

  // Logout Function
  const handleLogout = () => {
    console.log("Logging out...");

    // Clear authentication data (if needed)
    // localStorage.removeItem("token"); // Example for clearing token

    // Redirect to home page (root of the app)
    router.push("/"); // Redirecting to the home page
  };

  return (
    <div className="bg-gray-900 text-white w-full fixed top-0 left-0 flex justify-between items-center px-6 py-0 z-50">
      {/* Logo on the left with controlled height */}
      <div className="flex items-center">
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt="EduCertify Logo" 
            width={70} // Reduced width to make the logo smaller
            height={15} // Reduced height to make the logo smaller
            className="object-contain" // Ensure logo maintains aspect ratio
          />
        </Link>
      </div>

      {/* Right-aligned navbar items */}
      <div className="flex space-x-6 items-center">
        {/* Admin Profile Button with Icon */}
        <Link href="/admin/profile" className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2">
          <FaCrown size={20} /> {/* Admin icon */}
        </Link>

        {/* Contact Button with Phone Icon */}
        <Link href="/admin/contact" className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2">
          <FaPhoneAlt size={20} /> {/* Phone icon for contact */}
        </Link>

        <Link href="/admin/settings" className="bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded flex items-center space-x-2">
          <FaCogs size={20} /> {/* Phone icon for contact */}
        </Link>

        {/* Logout Button with Icon */}
        <button
          className="bg-red-500 hover:bg-red-700 px-3 py-3 rounded text-white flex items-center space-x-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt size={20} /> {/* Logout icon */}        
        </button>
      </div>
    </div>
  );
}
