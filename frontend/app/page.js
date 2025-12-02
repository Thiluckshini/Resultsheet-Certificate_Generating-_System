// frontend/app/page.js
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import dynamic from 'next/dynamic';

// Dynamically import Register component to avoid SSR issues
const Register = dynamic(() => import('./register/page'), { ssr: false });

export default function Home() {
  const [role, setRole] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // State for switching between login/register
  const router = useRouter();

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setShowLogin(true);

    // Redirect based on the selected role
    if (selectedRole === "admin") {
      router.push("/admin/login");
    } else if (selectedRole === "lecturer") {
      router.push("/lecturer/login");
    } else if (selectedRole === "institute-admin") {
      router.push("/institute-admin/login");
    } else if (selectedRole === "student") {
      router.push("/student/login");
    }
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering); // Toggle register view
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white px-4">
      {/* Logo */}
      <img 
        src="/logo.PNG" // Replace with your actual logo path
        alt="EduCertify Logo"
        className="w-32 h-32 mb-6" // Bigger logo for visibility
      />

      {/* App Title */}
      <h1 className="text-4xl font-extrabold mb-3 text-blue-400">EduCertify</h1>
      <h2 className="text-lg text-gray-300 mb-8">Result Sheet & Certificate Generator</h2>

      {/* Login/Register Tabs
      <div className="flex bg-gray-700 rounded-lg overflow-hidden w-[450px] mb-5">
        <button 
          className="flex-1 py-3 text-center bg-gray-600 text-white font-semibold border-b-2 border-blue-500"
          onClick={() => setIsRegistering(false)} // Switch to login
        >
          Login
        </button>
        <button 
          className="flex-1 py-3 text-center text-gray-300 hover:bg-gray-600 transition"
          onClick={toggleRegister} // Switch to register
        >
          Register
        </button>
      </div> */}

      {/* Conditional Rendering Based on Login/Register View */}
      {isRegistering ? (
        <div className="bg-gray-900 shadow-xl rounded-lg p-10 w-[450px] border border-gray-700">
          <h3 className="text-2xl font-bold mb-3 text-blue-300">Register an account</h3>
          <p className="text-sm text-gray-400 mb-5">Fill in your details to create a new account</p>
          
          {/* Add your registration form or component here */}
          <Register />
        </div>
      ) : (
        <div className="bg-gray-900 shadow-xl rounded-lg p-10 w-[450px] border border-gray-700">
          <h3 className="text-2xl font-bold mb-3 text-blue-300">Login to your account</h3>
          <p className="text-sm text-gray-400 mb-5">Enter your credentials to access your account</p>

          <label htmlFor="role" className="block text-gray-300 mb-3 text-lg">Select Your Role</label>
          <select
            id="role"
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={handleRoleChange}
            aria-label="Select Role"
          >
            <option value="" disabled>Select Role</option>
            <option value="admin">Super Admin</option>
            <option value="institute-admin">Institute Admin</option>
            <option value="lecturer">Lecturer</option>
            <option value="student">Student</option>
          </select>

          
        </div>
      )}
    </div>
  );
}
