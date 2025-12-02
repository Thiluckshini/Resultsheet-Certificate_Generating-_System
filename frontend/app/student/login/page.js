// frontend/app/student/login/page.js
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function StudentLogin() {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [nic, setNic] = useState("");
  const [institute, setInstitute] = useState("");
  const [department, setDepartment] = useState("");
  const [institutes, setInstitutes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/institutes');
        const data = await res.json();
        setInstitutes(data.map(inst => inst.name));
      } catch {
        setError("Unable to load institutes. Please try again later.");
      }
    };
    fetchInstitutes();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!institute) return;
      try {
        const res = await fetch(`http://localhost:5000/api/departments/by-institute/${encodeURIComponent(institute)}`);
        const data = await res.json();
        setDepartments(data.departments || []);
      } catch {
        setError("Unable to load departments.");
      }
    };
    fetchDepartments();
  }, [institute]);

  const handleLogin = async () => {
    setError("");
    setSuccessMessage("");
  
    if (!studentId || !nic || !institute || !department) {
      setError("Please fill all the fields and select an institute and department.");
      return;
    }
  
    try {
      const slugify = (text) =>
        text.toLowerCase().trim().replace(/\s+/g, '-');
  
      // Slugify institute before fetch
      const instituteSlug = slugify(institute);
  
      const res = await fetch(`http://localhost:5000/api/students/by-institute/${encodeURIComponent(instituteSlug)}`);
      const students = await res.json();
  
      const departmentSlug = slugify(department);
  
      // Find student matching id AND nic AND department
      const matchedStudent = students.find(
        (s) =>
          s.student_id === studentId.trim() &&
          s.nic === nic.trim() &&
          slugify(s.department) === departmentSlug
      );
  
      if (matchedStudent) {
        setSuccessMessage("Login successful!");
  
        // Prepare slugs for routing
        const instituteSlug = slugify(matchedStudent.institute);
        const departmentSlug = slugify(matchedStudent.department);
  
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem(
          "student",
          JSON.stringify({
            id: matchedStudent.student_id,
            name: matchedStudent.name,
            institute_slug: instituteSlug,
            department_slug: departmentSlug,
          })
        );
  
        router.push(`/student/${instituteSlug}/${departmentSlug}/dashboard`);
      } else {
        setError("Invalid credentials or department selection.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Student Login</h1>

        {/* Selects & Inputs */}
        <div className="mb-4">
          <label htmlFor="institute" className="block mb-1">Institute</label>
          <select
            id="institute"
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white"
          >
            <option value="">Select Institute</option>
            {institutes.map((inst, idx) => (
              <option key={idx} value={inst}>{inst}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="department" className="block mb-1">Department</label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white"
            disabled={!institute}
          >
            <option value="">Select Department</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="studentId" className="block mb-1">Student ID</label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white"
            placeholder="Enter Student ID"
          />
        </div>

        <div className="mb-4 relative">
          <label htmlFor="nic" className="block mb-1">NIC (Password)</label>
          <input
            id="nic"
            type={showPassword ? "text" : "password"}
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            className="w-full p-3 pr-10 rounded bg-gray-700 text-white"
            placeholder="Enter NIC"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2/3 transform -translate-y-1/2"
          >
            {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Feedback */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {/* Buttons */}
        <button onClick={handleLogin} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded font-bold">
          Login
        </button>

        <p className="text-center mt-4">
          <a href="/forgot-password" className="text-blue-400 hover:underline">Forgot Password?</a>
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 p-3 rounded bg-gray-600 hover:bg-gray-700 font-bold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
