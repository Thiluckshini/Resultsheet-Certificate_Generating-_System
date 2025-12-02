"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 

const ForgotPassword = () => {
  const [role, setRole] = useState(""); 
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!username || !role) {
      setError("Please fill in all fields.");
      setMessage("");
      return;
    }
    setMessage(`Password reset link sent to the ${role}'s registered email.`);
    setError("");
    setUsername("");
    setRole(""); // Reset role selection
  };

  const handleBack = () => {
    if (!role) {
      setError("Please select a role before going back to login.");
      return;
    }
    const path = `/${role}/login`; // Dynamically generate the path
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>

        <div className="mb-4">
          <label className="block mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value="" disabled>Select Role</option>
            <option value="admin">Super Admin</option>
            <option value="institute-admin">Institute Admin</option>
            <option value="lecturer">Lecturer</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Username / Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
            placeholder="Enter your username or email"
          />
        </div>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-3 text-center">{message}</p>}

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold text-white transition duration-300"
          onClick={handleSubmit}
        >
          Send Reset Link
        </button>

        <button
          className="w-full mt-4 bg-gray-600 hover:bg-gray-700 p-3 rounded font-bold text-white transition duration-300"
          onClick={handleBack}
        >
          Back to Login
        </button>
        
      </div>
    </div>
  );
};

export default ForgotPassword;
