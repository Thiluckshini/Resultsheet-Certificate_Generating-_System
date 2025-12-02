"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setError("");
    setSuccessMessage(""); // Clear error when user starts typing
  }, [username, password]);

  const handleLogin = () => {
    // Specific credentials for admin login
    const adminUsername = "admin";
    const adminPassword = "admin123";

    // Check if both username and password match the admin credentials
    if (username === adminUsername && password === adminPassword) {
      setSuccessMessage("Login successful!");
      localStorage.setItem("isAuthenticated", "true"); // Store login state
      router.push("/admin/dashboard"); // Redirect to admin dashboard
    } else if (!username || !password) {
      setError("Please fill all the fields"); // Error for empty fields
    } else {
      setError("Invalid username or password"); // Error for incorrect credentials
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Super Admin Login</h1>
        <p className="text-left mb-6">Enter your credentials to successfull login.</p>

        {/* Username Input */}
        <div className="mb-4">
            <label htmlFor="username" className="block text-white mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
              placeholder="Enter username"
              required
            />
          </div>

        {/* Password Input */}
        <div className="mb-4 relative">
            <label htmlFor="password" className="block text-white mb-1">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white pr-10"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2/3 transform -translate-y-1/2 p-4"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeSlashIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

         {/* Success Message */}
         {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

        {/* Login Button */}
        <button
          className={`w-full p-3 rounded bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-bold transition duration-300 ${
            username && password ? "" : "cursor-not-allowed opacity-50"
          }`}
          onClick={handleLogin}
          disabled={!username || !password}
        >
          Login
        </button>

        {/* Forgot Password Link */}
        <p className="text-center mt-4">
          <a href="/forgot-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </a>
        </p>

        {/* Back Button */}
        <button
          className="w-full p-3 mt-4 rounded bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 text-white font-bold transition duration-300"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
