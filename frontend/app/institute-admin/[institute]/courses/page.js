// frontend/app/institute-admin/[institute]/courses/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../../../components/InstituteAdminSidebar';
import AdminTopbar from '../../../../components/InstituteAdminTopbar';

export default function CoursesPage() {
  const { institute: encodedInstitute } = useParams();
  const decodedInstitute = decodeURIComponent(encodedInstitute);

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [newCourse, setNewCourse] = useState({
    name: '',
    course_code: '',
    description: '',
    department: '',
    duration: '',
    institute: decodedInstitute,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    if (decodedInstitute) {
      fetchDepartments();
      fetchCourses();
      setNewCourse((prev) => ({ ...prev, institute: decodedInstitute }));
      setIsEditing(false);
      setEditingCourseId(null);
      setSuccessMessage('');
    }
  }, [decodedInstitute]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/departments/by-institute/${encodedInstitute}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Error fetching departments');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/by-institute/${encodedInstitute}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      console.log('Fetched courses:', data.courses);  // Debug
      setCourses(data || []);

    } catch (error) {
      alert('Error fetching courses.');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    const { name, course_code, department, description, institute, duration } = newCourse;
    if (!name || !course_code || !description || !institute || !department || !duration) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:5000/api/courses/${editingCourseId}`
        : 'http://localhost:5000/api/courses';
      const method = isEditing ? 'PUT' : 'POST';

      const courseToSave = { ...newCourse, institute: decodedInstitute };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseToSave),
      });

      if (!response.ok) throw new Error(await response.text());

      setSuccessMessage(isEditing ? '✅ Course updated successfully!' : '✅ Course added successfully!');

      setNewCourse({
        name: '',
        course_code: '',
        description: '',
        department: '',
        duration: '',
        institute: decodedInstitute,
      });
      setIsEditing(false);
      setEditingCourseId(null);

      fetchCourses();
    } catch (error) {
      alert('Error saving course.');
      console.error('Error saving course:', error);
    }
  };

  const handleEditCourse = (course) => {
    setNewCourse({
      name: course.name || '',
      course_code: course.course_code || '',
      description: course.description || '',
      department: course.department || '',
      duration: course.duration || '',
      institute: course.institute || decodedInstitute,
    });
    setIsEditing(true);
    setEditingCourseId(course.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(await response.text());

      alert('Course deleted successfully.');
      fetchCourses();
    } catch (error) {
      alert('Error deleting course.');
      console.error(error);
    }
  };

  // Normalize and group courses by department
  const coursesByDepartment = courses.reduce((acc, course) => {
    const key = course.department?.trim().toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {});

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Course Management - {decodedInstitute}</h1>

          {/* Course Form */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Update Course' : 'Add New Course'}</h2>
            {successMessage && (
              <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
            )}
            <form onSubmit={handleAddCourse}>
              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCourse.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Course Code</label>
                <input
                  type="text"
                  name="course_code"
                  value={newCourse.course_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Description</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Department</label>
                <select
                  name="department"
                  value={newCourse.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 capitalize">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={newCourse.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 Years, 6 Months"
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  {isEditing ? 'Update Course' : 'Add Course'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingCourseId(null);
                      setNewCourse({
                        name: '',
                        course_code: '',
                        description: '',
                        department: '',
                        duration: '',
                        institute: decodedInstitute,
                      });
                      setSuccessMessage('');
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

{/* Department-wise course tables */}
{departments.length === 0 && (
  <p className="text-gray-500">No departments found for this institute.</p>
)}

{departments.map((dept) => {
  const deptKey = dept.name.trim().toLowerCase();
  const deptCourses = courses.filter(
    (course) =>
      course.department?.trim().toLowerCase() === deptKey
  );

  return (
    <div key={dept.id} className="bg-white p-4 rounded shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Department: {dept.name}</h2>
      {deptCourses.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Course Code</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deptCourses.map((course) => (
              <tr key={course.id}>
                <td className="border px-4 py-2">{course.course_code}</td>
                <td className="border px-4 py-2">{course.name}</td>
                <td className="border px-4 py-2">{course.description}</td>
                <td className="border px-4 py-2">{course.duration}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditCourse(course)}
                    style={{
                      backgroundColor: '#90EE90',
                      color: 'black',
                      padding: '0.25rem 1rem',
                      borderRadius: '0.375rem',
                      marginRight: '0.5rem',
                    }}
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    style={{
                      backgroundColor: '#FF6347',
                      color: 'white',
                      padding: '0.25rem 1rem',
                      borderRadius: '0.375rem',
                    }}
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No courses found in this department.</p>
      )}
    </div>
  );
})}

        </div>
      </div>
    </div>
  );
}