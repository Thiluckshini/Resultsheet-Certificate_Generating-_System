'use client';

import LecturerSidebar from '@/components/LecturerSidebar';
import LecturerTopbar from '@/components/LecturerTopbar';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function StudentsPage() {
  const { instituteSlug, departmentSlug } = useParams();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [expandedYears, setExpandedYears] = useState({});
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentForm, setStudentForm] = useState({
    student_id: '',
    name: '',
    nic: '',
    course: '',
    year: '',
    email: '',
    contact_number: '',
    address: '',
    department: departmentSlug,
    institute: instituteSlug,
  });

  const years = Array.from({ length: 10 }, (_, i) => 2015 + i);
  const [isClient, setIsClient] = useState(false);

  const capitalizeWords = (str) =>
    str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  useEffect(() => {
    const lecturer = JSON.parse(sessionStorage.getItem('lecturer') || '{}');
    if (!lecturer?.id) {
      router.push('/lecturer/login');
      return;
    }
    setIsClient(true);
    fetchStudents();
    fetchCourses();
  }, [router, instituteSlug, departmentSlug]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  async function fetchStudents() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students/by-institute-department?institute=${instituteSlug}&department=${departmentSlug}`
      );
      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to fetch students', err);
    }
  }

  async function fetchCourses() {
    try {
      const res = await fetch(`http://localhost:5000/api/courses/by-institute/${instituteSlug}`);
      const text = await res.text();

      if (!res.ok) {
        console.error("Failed to fetch courses:", res.status, text);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = JSON.parse(text);
        setCourses(data);
      } else {
        console.error("Unexpected response format:", text);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  }

  const handleChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingStudentId
      ? `http://localhost:5000/api/students/${editingStudentId}`
      : 'http://localhost:5000/api/students';

    const method = editingStudentId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm),
      });

      if (res.ok) {
        alert(editingStudentId ? 'Student updated' : 'Student added');
        setStudentForm({
          student_id: '',
          name: '',
          nic: '',
          course: '',
          year: '',
          email: '',
          contact_number: '',
          address: '',
          department: departmentSlug,
          institute: instituteSlug,
        });
        setEditingStudentId(null);
        fetchStudents();
      } else {
        alert('Error saving student');
      }
    } catch (err) {
      console.error('Error saving student', err);
    }
  };

  const handleEdit = (student) => {
    setStudentForm({
      student_id: student.student_id,
      name: student.name,
      nic: student.nic,
      course: student.course,
      year: student.year,
      email: student.email,
      contact_number: student.contact_number,
      address: student.address,
      department: departmentSlug,
      institute: instituteSlug,
    });
    setEditingStudentId(student.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Student deleted');
        fetchStudents();
      } else {
        alert('Failed to delete student');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.student_id.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.nic.toLowerCase().includes(query)
    );
  });
  
  const studentsByYear = filteredStudents.reduce((acc, student) => {
    (acc[student.year] = acc[student.year] || []).push(student);
    return acc;
  }, {});
  

  return (
    <div className="flex h-screen">
      <LecturerSidebar />
      <div className="flex-1">
        <LecturerTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Student Management - {capitalizeWords(instituteSlug)}
          </h1>

          {/* Form */}
          <div className="bg-white p-6 rounded shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingStudentId ? 'Edit Student' : 'Add New Student'}
            </h2>
            <form onSubmit={handleSubmit}>
              {[
                { label: 'Student ID', name: 'student_id', disabled: !!editingStudentId },
                { label: 'Full Name', name: 'name' },
                { label: 'NIC', name: 'nic' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Contact Number', name: 'contact_number' },
              ].map(({ label, name, type = 'text', disabled }) => (
                <div className="mb-4" key={name}>
                  <label className="block text-gray-700 capitalize">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={studentForm[name]}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    required
                  />
                </div>
              ))}

              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Department</label>
                <input
                  type="text"
                  value={capitalizeWords(departmentSlug)}
                  disabled
                  className="w-full px-4 py-2 border border-gray-400 rounded bg-gray-200 cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Course</label>
                <select
                  name="course"
                  value={studentForm.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Year / Batch</label>
                <select
                  name="year"
                  value={studentForm.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                >
                  <option value="">Select Year/Batch</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Address</label>
                <textarea
                  name="address"
                  value={studentForm.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  {editingStudentId ? 'Update Student' : 'Add Student'}
                </button>
                {editingStudentId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStudentId(null);
                      setStudentForm({
                        student_id: '',
                        name: '',
                        nic: '',
                        course: '',
                        year: '',
                        email: '',
                        contact_number: '',
                        address: '',
                        department: departmentSlug,
                        institute: instituteSlug,
                      });
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

<div className="mb-4 flex justify-end items-center">
            {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 transition duration-200"
              title="Search"
            >
             <FaSearch className="text-gray-700 text-lg" />
             <span className="text-gray-700 font-medium">Search</span>
            </button>

  
  ) : (
    <div className="relative w-full md:w-1/3">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by Student ID or Name"
        className="w-full px-4 py-2 bg-white border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  )}
</div>




         


          {/* Students grouped by year with collapsible tables */}
          {Object.entries(studentsByYear).length === 0 ? (
            <p className="text-gray-600">No students found.</p>
          ) : (
            Object.entries(studentsByYear).map(([year, studentsInYear]) => (
              <div key={year} className="mb-6">
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
                >
                  {expandedYears[year] ? '▼' : '▶'} Year: {year}
                </button>

                {expandedYears[year] && (
                  <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white rounded shadow-md">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Student ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">NIC</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Contact</th>
                        <th className="border px-4 py-2">Course</th>
                        <th className="border px-4 py-2">Address</th>
                        <th className="border px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsInYear.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{student.student_id}</td>
                          <td className="border px-4 py-2">{student.name}</td>
                          <td className="border px-4 py-2">{student.nic}</td>
                          <td className="border px-4 py-2">{student.email}</td>
                          <td className="border px-4 py-2">{student.contact_number}</td>
                          <td className="border px-4 py-2">{student.course}</td>
                          <td className="border px-4 py-2">{student.address}</td>
                          <td className="border px-4 py-2 text-center space-x-2">
                            <button
                              onClick={() => handleEdit(student)}
                              className="bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
