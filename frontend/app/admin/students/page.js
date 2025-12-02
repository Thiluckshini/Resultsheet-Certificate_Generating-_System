'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminStudentsPage() {
  const [studentsByInstitute, setStudentsByInstitute] = useState({});
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [expandedInstitutes, setExpandedInstitutes] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [expandedYears, setExpandedYears] = useState({});
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    course: '',
    year: '',
    institute: '',
    department: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Normalize strings for consistent keys
  const normalizeKey = (str) =>
    str?.toLowerCase().trim().replace(/\s+/g, '-') || 'unknown';

  useEffect(() => {
    fetchInstitutes();
    fetchStudents();
  }, []);

  // Fetch all institutes (even if no students)
  const fetchInstitutes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/institutes');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAllInstitutes(data);
    } catch (err) {
      console.error('Error fetching institutes:', err);
      alert('Error fetching institutes');
    }
  };

  // Fetch students and group by normalized institute > department > year
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      const grouped = {};

      data.forEach((student) => {
        const instRaw = student.institute?.trim() || 'Unknown Institute';
        const deptRaw = student.department?.trim() || 'Unknown Department';
        const yearRaw = student.year || 'Unknown Year';

        const instKey = normalizeKey(instRaw);
        const deptKey = normalizeKey(deptRaw);
        const yearKey = yearRaw;

        if (!grouped[instKey]) {
          grouped[instKey] = {
            displayName: instRaw,
            departments: {},
          };
        }

        if (!grouped[instKey].departments[deptKey]) {
          grouped[instKey].departments[deptKey] = {
            displayName: deptRaw,
            years: {},
          };
        }

        if (!grouped[instKey].departments[deptKey].years[yearKey]) {
          grouped[instKey].departments[deptKey].years[yearKey] = [];
        }

        grouped[instKey].departments[deptKey].years[yearKey].push(student);
      });

      setStudentsByInstitute(grouped);
    } catch (err) {
      console.error('Error fetching students:', err);
      alert('Error fetching students');
    }
  };

  const toggleInstitute = (instKey) => {
    setExpandedInstitutes((prev) => ({
      ...prev,
      [instKey]: !prev[instKey],
    }));
  };

  const toggleDepartment = (instKey, deptKey) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [instKey]: {
        ...prev[instKey],
        [deptKey]: !prev[instKey]?.[deptKey],
      },
    }));
  };

  const toggleYear = (instKey, deptKey, yearKey) => {
    setExpandedYears((prev) => ({
      ...prev,
      [instKey]: {
        ...prev[instKey],
        [deptKey]: {
          ...prev[instKey]?.[deptKey],
          [yearKey]: !prev[instKey]?.[deptKey]?.[yearKey],
        },
      },
    }));
  };

  const startEditing = (student) => {
    setEditingStudent(student.id);
    setFormData({ ...student });
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingStudent(null);
    setFormData({
      id: '',
      name: '',
      email: '',
      course: '',
      year: '',
      institute: '',
      department: '',
    });
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    const { name, email, course, year } = formData;
    if (!name || !email || !course || !year) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/students/${editingStudent}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      setSuccessMessage('✅ Student updated successfully!');
      await fetchStudents();
      cancelEditing();
    } catch (err) {
      alert('Error saving student.');
      console.error(err);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Student deleted successfully.');
      await fetchStudents();
    } catch (err) {
      alert('Error deleting student.');
      console.error(err);
    }
  };

  const formatName = (str) =>
    str
      ?.toLowerCase()
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">Manage Students by Institute</h1>

          {/* Edit Student Form */}
          {editingStudent && (
            <div className="bg-white p-4 rounded shadow-md mb-6 max-w-xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Update Student</h2>
              {successMessage && (
                <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
              )}
              <form onSubmit={handleSaveStudent}>
                {['name', 'email', 'course', 'year'].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block text-gray-700 capitalize">{field}</label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-400 rounded"
                      required
                    />
                  </div>
                ))}
                <div className="mb-4">
                  <label className="block text-gray-700">Institute</label>
                  <input
                    type="text"
                    name="institute"
                    value={formData.institute || ''}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    disabled
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Update Student
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Institutes List */}
          {allInstitutes.length === 0 && (
            <p className="italic text-gray-500">No institutes available.</p>
          )}

          {Object.keys(studentsByInstitute).length === 0 && allInstitutes.length > 0 && (
            <p className="italic text-gray-500">No students found.</p>
          )}

          {allInstitutes.map((inst) => {
            const instKey = normalizeKey(inst.name);
            const instituteGroup = studentsByInstitute[instKey];
            const departments = instituteGroup?.departments || {};

            return (
              <div key={instKey} className="mb-6">
                <button
                  onClick={() => toggleInstitute(instKey)}
                  className="w-full bg-white hover:bg-blue-100 text-left text-xl font-semibold text-blue-800 px-6 py-3 rounded shadow mb-2 transition-all"
                >
                  {expandedInstitutes[instKey] ? '▼' : '▶'} {formatName(inst.name)}
                </button>

                {expandedInstitutes[instKey] && (
                  <div className="bg-white p-4 rounded shadow-md">
                    {Object.keys(departments).length > 0 ? (
                      Object.entries(departments).map(([deptKey, deptGroup]) => (
                        <div key={deptKey} className="mb-4">
                          <button
                            onClick={() => toggleDepartment(instKey, deptKey)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
                          >
                            {expandedDepartments[instKey]?.[deptKey] ? '▼' : '▶'} Department: {formatName(deptGroup.displayName)}
                          </button>

                          

                          {expandedDepartments[instKey]?.[deptKey] && (
                            <div className="bg-white p-4 rounded shadow">
                              {Object.entries(deptGroup.years).map(([year, students]) => (
                                    <div key={year} className="mb-6">
                                    <button
                                      onClick={() => toggleYear(instKey, deptKey, year)}
                                      className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
                                    >
                                      {expandedYears[instKey]?.[deptKey]?.[year] ? '▼' : '▶'} Year: {formatName(year)}
                                    </button>
                                  
                                    {expandedYears[instKey]?.[deptKey]?.[year] && (
                                      <table className="w-full table-auto border-collapse border border-gray-300">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            <th className="border px-4 py-2">Name</th>
                                            <th className="border px-4 py-2">Email</th>
                                            <th className="border px-4 py-2">Course</th>
                                            <th className="border px-4 py-2">Year</th>
                                            <th className="border px-4 py-2">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {students.map((student) => (
                                            <tr key={student.id}>
                                              <td className="border px-4 py-2">{student.name}</td>
                                              <td className="border px-4 py-2">{student.email}</td>
                                              <td className="border px-4 py-2">{student.course}</td>
                                              <td className="border px-4 py-2">{student.year}</td>
                                              <td className="border px-4 py-2">
                                                <button
                                                  onClick={() => startEditing(student)}
                                                  className="bg-green-300 text-black px-2 py-1 rounded mr-2"
                                                  title="Edit student"
                                                >
                                                  <FaEdit />
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteStudent(student.id)}
                                                  className="bg-red-500 text-white px-2 py-1 rounded"
                                                  title="Delete student"
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
                                  
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="italic text-gray-600">No departments found.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
