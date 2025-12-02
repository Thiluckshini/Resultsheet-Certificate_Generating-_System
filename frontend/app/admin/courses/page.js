'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminCoursesPage() {
  const [coursesByInstitute, setCoursesByInstitute] = useState({});
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [expandedInstitutes, setExpandedInstitutes] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    duration: '',
    institute: '',
    department: '',
    course_code: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Normalize strings for consistent keys
  const normalizeKey = (str) =>
    str?.toLowerCase().trim().replace(/\s+/g, '-') || 'unknown';

  useEffect(() => {
    fetchInstitutes();
    fetchCourses();
  }, []);

  // Fetch all institutes (even if no courses)
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

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Group by normalized institute > department
      const grouped = {};

      data.forEach((course) => {
        const instRaw = course.institute?.trim() || 'Unknown Institute';
        const deptRaw = course.department?.trim() || 'Unknown Department';

        const instKey = normalizeKey(instRaw);
        const deptKey = normalizeKey(deptRaw);

        if (!grouped[instKey]) {
          grouped[instKey] = {
            displayName: instRaw,
            departments: {},
          };
        }

        if (!grouped[instKey].departments[deptKey]) {
          grouped[instKey].departments[deptKey] = {
            displayName: deptRaw,
            courses: [],
          };
        }

        grouped[instKey].departments[deptKey].courses.push(course);
      });

      setCoursesByInstitute(grouped);
    } catch (err) {
      console.error('Error fetching courses:', err);
      alert('Error fetching courses');
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

  const startEditing = (course) => {
    setEditingCourse(course.id);
    setFormData({ ...course });
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingCourse(null);
    setFormData({
      id: '',
      name: '',
      description: '',
      duration: '',
      institute: '',
      department: '',
      course_code: '',
    });
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const { name, description, duration, institute, department, course_code } = formData;

    if (!name || !description || !duration || !institute || !department || !course_code) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const url = `http://localhost:5000/api/courses/${editingCourse}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      setSuccessMessage('✅ Course updated successfully!');
      await fetchCourses();
      cancelEditing();
    } catch (err) {
      alert('Error saving course.');
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Course deleted successfully.');
      await fetchCourses();
    } catch (err) {
      alert('Error deleting course.');
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
          <h1 className="text-3xl font-bold mb-6">Manage Courses by Institute</h1>

          {/* Edit Course Form */}
          {editingCourse && (
            <div className="bg-white p-4 rounded shadow-md mb-6 max-w-xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Update Course</h2>
              {successMessage && (
                <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
              )}
              <form onSubmit={handleSaveCourse}>
                {['name', 'description', 'duration', 'course_code'].map((field) => (
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
                    Update Course
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

          {Object.keys(coursesByInstitute).length === 0 && allInstitutes.length > 0 && (
            <p className="italic text-gray-500">No courses found.</p>
          )}

          {allInstitutes.map((inst) => {
            const instKey = normalizeKey(inst.name);
            const instituteGroup = coursesByInstitute[instKey];
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
                    {Object.keys(departments).length === 0 && (
                      <p className="italic text-gray-600">No departments with courses.</p>
                    )}
                    {Object.entries(departments).map(([deptKey, dept]) => (
                      <div key={deptKey} className="mb-4 border-b border-gray-300 pb-2">
                        <button
                          onClick={() => toggleDepartment(instKey, deptKey)}
                          className="w-full text-left font-semibold text-gray-800 hover:text-blue-600"
                        >
                          {expandedDepartments[instKey]?.[deptKey] ? '▼' : '▶'}{' '}
                          {formatName(dept.displayName)}
                        </button>

                        {expandedDepartments[instKey]?.[deptKey] && (
                          <table className="table-auto w-full mt-2 text-sm border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="border border-gray-300 px-3 py-1">Name</th>
                                <th className="border border-gray-300 px-3 py-1">Course Code</th>
                                <th className="border border-gray-300 px-3 py-1">Description</th>
                                <th className="border border-gray-300 px-3 py-1">Duration</th>
                                <th className="border border-gray-300 px-3 py-1">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dept.courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-100">
                                  <td className="border border-gray-300 px-3 py-1">{course.name}</td>
                                  <td className="border border-gray-300 px-3 py-1">{course.course_code}</td>
                                  <td className="border border-gray-300 px-3 py-1">{course.description}</td>
                                  <td className="border border-gray-300 px-3 py-1">{course.duration}</td>
                                  <td className="border border-gray-300 px-3 py-1 text-center space-x-2">
                                    <button
                                      onClick={() => startEditing(course)}
                                      className="bg-green-300 text-black px-2 py-1 rounded mr-2"
                                      title="Edit Course"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCourse(course.id)}
                                      className="bg-red-500 text-white px-2 py-1 rounded"
                                      title="Delete Course"
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
