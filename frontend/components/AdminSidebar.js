import Link from "next/link"; // Import Link from Next.js
import { FaTachometerAlt, FaSchool, FaUserShield, FaUserTie, FaChalkboard, FaUsers, FaBookOpen, FaCertificate, FaBuilding,  FaAward, FaCogs } from "react-icons/fa"; // Importing icons from react-icons

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen pt-18 fixed"> {/* Increased padding-top */}
      <ul className="space-y-4 p-4">
        <li>
          <Link href="/admin/dashboard">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaTachometerAlt size={20} /> {/* Dashboard Icon */}
              <span>Dashboard</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/institutes">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaSchool size={20} /> {/* Institutes Icon */}
              <span>Institutes</span>
            </button>
          </Link>
        </li>
        <li>
  <Link href="/admin/institute-admins">
    <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
      <FaUserShield size={20} /> {/* Admin Icon */}
      <span>Institute Admins</span>
    </button>
  </Link>
</li>

<li>
          <Link href="/admin/departments">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaBuilding size={20} /> {/* Dep Icon */}
              <span>Departments</span>
            </button>
          </Link>
        </li>

        <li>
          <Link href="/admin/lecturers">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaUserTie size={20} /> {/* Lecturers Icon */}
              <span>Lecturers</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/students">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaUsers size={20} /> {/* Students Icon */}
              <span>Students</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/courses">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaChalkboard size={20} /> {/* Courses Icon */}
              <span>Courses</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/subjects">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaBookOpen size={20} /> {/* Subjects Icon */}
              <span>Subjects</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/resultsheets">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaCertificate size={20} /> {/* Subjects Icon */}
              <span>Result Sheets</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/certificates">
            <button className="w-full py-2 px-4 hover:bg-gray-700 rounded text-left flex items-center space-x-2">
              <FaAward size={20} /> {/* Approvals Icon */}
              <span>Certificates</span>
            </button>
          </Link>
        </li>
        
      </ul>
    </div>
  );
}
