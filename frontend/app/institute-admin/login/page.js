"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function InstituteAdminLogin() {
  const router = useRouter();

  const [adminId, setAdminId] = useState("");
  const [nic, setNic] = useState("");
  const [institute, setInstitute] = useState("");
  const [institutes, setInstitutes] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch institutes from backend on mount
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/institutes');
        if (!res.ok) throw new Error('Failed to fetch institutes');
        const data = await res.json();
        setInstitutes(data.map(inst => inst.name));
      } catch (err) {
        setError("Unable to load institutes. Please try again later.");
      }
    };
    fetchInstitutes();
  }, []);

  const handleLogin = async () => {
    setError("");
    setSuccessMessage("");

    if (!adminId || !nic || !institute) {
      setError("Please fill all the fields and select an institute.");
      return;
    }

    try {
      // Fetch all institute admins from backend
      const res = await fetch("http://localhost:5000/api/institute-admins");
      if (!res.ok) throw new Error("Failed to fetch institute admins");

      const admins = await res.json();

      // Find matching admin
      const matchedAdmin = admins.find(
        admin =>
          admin.admin_id === adminId &&
          admin.nic === nic &&
          admin.institute.toLowerCase() === institute.toLowerCase()
      );

      if (matchedAdmin) {
        setSuccessMessage("Login successful!");
        setError("");

        // Store session info
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("admin_id", matchedAdmin.admin_id);
        sessionStorage.setItem("institute", matchedAdmin.institute);

        // Redirect to dashboard with URL-friendly institute slug
        const instituteSlug = encodeURIComponent(
          matchedAdmin.institute.trim().toLowerCase().replace(/\s+/g, '-')
        );
        router.push(`/institute-admin/${instituteSlug}/dashboard`);
      } else {
        setError("Invalid credentials or institute selection.");
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Institute Admin Login</h1>
        <p className="mb-6 text-left">
          Select your institute, enter your Admin ID and NIC to login.
        </p>

        {/* Institute Dropdown */}
        <div className="mb-4">
          <label htmlFor="institute" className="block mb-1 text-white">Institute</label>
          <select
            id="institute"
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
            required
          >
            <option value="" disabled>Select Institute</option>
            {institutes.length > 0 ? (
              institutes.map((inst, idx) => (
                <option key={idx} value={inst}>{inst}</option>
              ))
            ) : (
              <option disabled>Loading institutes...</option>
            )}
          </select>
        </div>

        {/* Admin ID Input */}
        <div className="mb-4">
          <label htmlFor="adminId" className="block mb-1 text-white">Admin ID</label>
          <input
            id="adminId"
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
            placeholder="Enter Admin ID"
            required
          />
        </div>

        {/* NIC (Password) Input with Show/Hide */}
        <div className="mb-4 relative">
          <label htmlFor="nic" className="block mb-1 text-white">NIC (Password)</label>
          <input
            id="nic"
            type={showPassword ? "text" : "password"}
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white pr-10"
            placeholder="Enter NIC"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2/3 transform -translate-y-1/2 p-2"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!adminId || !nic || !institute}
          className={`w-full p-3 rounded font-bold transition duration-300
            ${adminId && nic && institute ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300' : 'bg-blue-600 opacity-50 cursor-not-allowed'}`}
        >
          Login
        </button>

        {/* Forgot Password Link */}
        <p className="text-center mt-4">
          <a href="/forgot-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </a>
        </p>

        {/* Back to Home */}
        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 p-3 rounded bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 text-white font-bold transition duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
