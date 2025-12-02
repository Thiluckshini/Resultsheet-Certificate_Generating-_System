'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminSidebar from '../../../../components/InstituteAdminSidebar';
import AdminTopbar from '../../../../components/InstituteAdminTopbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function InstituteStudentsPage() {
  const { institute } = useParams(); // dynamic [institute] param from URL

  const [studentsByInstitute, setStudentsByInstitute] = useState({});
  const [studentsByDepartment, setStudentsByDepartment] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [expandedYears, setExpandedYears] = useState({});
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    course: '',
    year: '',
    institute: '',
    department: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const normalizeKey = (str) =>
    str?.toLowerCase().trim().replace(/\s+/g, '-') || 'unknown';

  useEffect(() => {
    fetchStudents();
  }, [institute]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students/by-institute?institute=${encodeURIComponent(institute)}`
      );

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

      const selectedInstKey = normalizeKey(decodeURIComponent(institute));
      if (grouped[selectedInstKey]) {
        setStudentsByDepartment(grouped[selectedInstKey].departments);
      } else {
        setStudentsByDepartment({});
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      alert('Error fetching students');
    }
  };

  // Toggle department with flat key: "instKey|deptKey"
  const toggleDepartment = (instKey, deptKey) => {
    const key = `${instKey}|${deptKey}`;
    setExpandedDepartments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle year with flat key: "instKey|deptKey|yearKey"
  const toggleYear = (instKey, deptKey, yearKey) => {
    const key = `${instKey}|${deptKey}|${yearKey}`;
    setExpandedYears((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const startEditing = (student) => {
    setEditingStudent(student.student_id);
    setFormData({ ...student });
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingStudent(null);
    setFormData({
      student_id: '',
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
    const {student_id, name, email, course, year } = formData;
    if (!student_id || !name || !email || !course || !year) {
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

  const formatName = (name) => {
    if (!name) return '';
    
    let decoded = decodeURIComponent(name);
    decoded = decoded.replace(/[-_]+/g, ' ');
    decoded = decoded.trim().replace(/\s+/g, ' ');
    
    return decoded
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const instKey = normalizeKey(institute);
  
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">Manage Students: {formatName(institute)}</h1>
  
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
  
          {Object.keys(studentsByDepartment).length === 0 ? (
            <p className="italic text-gray-600">No students found.</p>
          ) : (
            Object.entries(studentsByDepartment).map(([deptKey, deptGroup]) => {
              const deptExpandedKey = `${instKey}|${deptKey}`;
              return (
                <div key={deptKey} className="mb-6">
                  <button
                    onClick={() => toggleDepartment(instKey, deptKey)}
                    className="w-full bg-white hover:bg-blue-100 text-left text-xl font-semibold text-blue-800 px-6 py-3 rounded shadow mb-2 transition-all"
                  >
                    {expandedDepartments[deptExpandedKey] ? '▼' : '▶'} Department: {formatName(deptGroup.displayName)}
                  </button>
  
                  {expandedDepartments[deptExpandedKey] &&
                    Object.entries(deptGroup.years).map(([year, students]) => {
                      const yearExpandedKey = `${instKey}|${deptKey}|${year}`;
                      return (
                        <div key={year} className="bg-white p-4 rounded shadow">
                          <button
                            onClick={() => toggleYear(instKey, deptKey, year)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded shadow mb-2 font-semibold"
                          >
                            {expandedYears[yearExpandedKey] ? '▼' : '▶'} Year: {year}
                          </button>
  
                          {expandedYears[yearExpandedKey] && (
                           <table className="w-full table-auto border-collapse border border-gray-300">
                              <thead className="bg-gray-100">
                                <tr>
                                <th className="border px-4 py-2">Student Id</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Course</th>
                                <th className="border px-4 py-2">Year</th>
                                <th className="border px-4 py-2">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map((student) => (
                                  <tr
                                    key={student.student_id}
                                  >
                                    <td className="border px-4 py-2">{student.student_id}</td>
                                    <td className="border px-4 py-2">{student.name}</td>
                                    <td className="border px-4 py-2">{student.email}</td>
                                    <td className="border px-4 py-2">{student.course}</td>
                                    <td className="border px-4 py-2">{student.year}</td>
                                    <td className="border px-4 py-2">
                                      <button
                                        onClick={() => startEditing(student)}
                                        title="Edit Student"
                                        className="bg-green-300 text-black px-2 py-1 rounded mr-2"
                                      >
                                        <FaEdit />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteStudent(student.id)}
                                        title="Delete Student"
                                        className="bg-red-500 text-white px-2 py-1 rounded"
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
                      );
                    })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
  
}
