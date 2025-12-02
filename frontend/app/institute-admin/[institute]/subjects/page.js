'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../../../components/InstituteAdminSidebar';
import AdminTopbar from '../../../../components/InstituteAdminTopbar';

export default function SubjectsPage() {
  const { institute: encodedInstitute } = useParams();
  const [decodedInstitute, setDecodedInstitute] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    credits: '',
    department: '',
    course: '',
    semester: '',
    institute: '',
  });

  const semesters = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    if (encodedInstitute) {
      const decoded = decodeURIComponent(encodedInstitute);
      setDecodedInstitute(decoded);
      setNewSubject((prev) => ({ ...prev, institute: decoded }));
    }
  }, [encodedInstitute]);

  useEffect(() => {
    if (decodedInstitute) {
      fetchDepartments();
      fetchCourses();
      fetchSubjects();
    }
  }, [decodedInstitute]);

  const fetchDepartments = async () => {
    const res = await fetch(`http://localhost:5000/api/departments/by-institute/${encodedInstitute}`);
    const data = await res.json();
    setDepartments(data.departments || []);
  };

  const fetchCourses = async () => {
    const res = await fetch(`http://localhost:5000/api/courses/by-institute/${encodedInstitute}`);
    const data = await res.json();
    setCourses(Array.isArray(data) ? data : data.courses || []);
  };
  
  const fetchSubjects = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/by-institute/${encodedInstitute}`);
      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : data.subjects || []);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
      alert('Failed to load subjects');
    }
  };

  const handleChange = (e) => {
    setNewSubject({ ...newSubject, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateSubject = async (e) => {
    e.preventDefault();
    const { name, code, credits, department, course, semester, institute } = newSubject;
    if (!name || !code || !credits || !department || !course || !semester) {
      alert('Please fill all fields');
      return;
    }

    const method = editingSubjectId ? 'PUT' : 'POST';
    const url = editingSubjectId
      ? `http://localhost:5000/api/subjects/${editingSubjectId}`
      : `http://localhost:5000/api/subjects`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newSubject, institute }),
    });

    if (res.ok) {
      alert(editingSubjectId ? 'Subject updated' : 'Subject added');
      setNewSubject({
        name: '',
        code: '',
        credits: '',
        department: '',
        course: '',
        semester: '',
        institute: decodedInstitute,
      });
      setEditingSubjectId(null);
      fetchSubjects();
    } else {
      alert('Failed to save subject');
    }
  };

  const handleEditSubject = (subject) => {
    setNewSubject({
      name: subject.name,
      code: subject.code,
      credits: subject.credits,
      department: subject.department,
      course: subject.course,
      semester: subject.semester,
      institute: decodedInstitute,
    });
    setEditingSubjectId(subject.id);
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    const res = await fetch(`http://localhost:5000/api/subjects/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Subject deleted');
      fetchSubjects();
    } else {
      alert('Failed to delete subject');
    }
  };

  const subjectsByDepartment = subjects.reduce((acc, subject) => {
    const key = subject.department?.trim().toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(subject);
    return acc;
  }, {});

  if (!decodedInstitute) return null; 

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Subject Management - {decodedInstitute}</h1>

          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingSubjectId ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <form onSubmit={handleAddOrUpdateSubject}>
              {[{ label: 'Subject Name', name: 'name', type: 'text' },
                { label: 'Subject Code', name: 'code', type: 'text' },
                { label: 'Credits', name: 'credits', type: 'number' }
              ].map(({ label, name, type }) => (
                <div key={name} className="mb-4">
                  <label className="block text-gray-700">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={newSubject[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    required
                  />
                </div>
              ))}

              {[{ label: 'Department', name: 'department', options: departments.map(d => d.name) },
                { label: 'Course', name: 'course', options: courses.map(c => c.name) },
                { label: 'Semester', name: 'semester', options: semesters.map((s) => `Semester ${s}`) },
              ].map(({ label, name, options }, i) => (
                <div key={i} className="mb-4">
                  <label className="block text-gray-700 capitalize">{label}</label>
                  <select
                    name={name}
                    value={newSubject[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    required
                  >
                    <option value="">{`Select ${label}`}</option>
                    {options.map((opt, idx) => (
                      <option key={idx} value={name === 'semester' ? idx + 1 : opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  {editingSubjectId ? 'Update Subject' : 'Add Subject'}
                </button>
                {editingSubjectId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubjectId(null);
                      setNewSubject({
                        name: '',
                        code: '',
                        credits: '',
                        department: '',
                        course: '',
                        semester: '',
                        institute: decodedInstitute,
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

          {departments.map((dept) => {
            const deptKey = dept.name.trim().toLowerCase();
            const deptSubjects = subjectsByDepartment[deptKey] || [];
            const subjectsBySemester = deptSubjects.reduce((acc, subj) => {
              const sem = subj.semester || 0;
              if (!acc[sem]) acc[sem] = [];
              acc[sem].push(subj);
              return acc;
            }, {});

            return (
              <div key={dept.id} className="bg-white p-4 rounded shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">Department: {dept.name}</h2>
                {Object.keys(subjectsBySemester).length > 0 ? (
                  Object.entries(subjectsBySemester).map(([sem, semSubjects]) => (
                    <div key={sem} className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Semester {sem}</h3>
                      <table className="min-w-full table-auto border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Code</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Course</th>
                            <th className="border px-4 py-2">Semester</th>
                            <th className="border px-4 py-2">Credits</th>
                            <th className="border px-4 py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semSubjects.map((subj) => (
                            <tr key={subj.id}>
                              <td className="border px-4 py-2">{subj.code}</td>
                              <td className="border px-4 py-2">{subj.name}</td>
                              <td className="border px-4 py-2">{subj.course}</td>
                              <td className="border px-4 py-2">{subj.semester}</td>
                              <td className="border px-4 py-2">{subj.credits}</td>
                              <td className="border px-4 py-2">
                                <button
                                  onClick={() => handleEditSubject(subj)}
                                  style={{
                                    backgroundColor: '#90EE90',
                                    color: 'black',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '0.375rem',
                                    marginRight: '0.5rem',
                                  }}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubject(subj.id)}
                                  style={{
                                    backgroundColor: '#FF6347',
                                    color: 'white',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '0.375rem',
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No subjects found for this department.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
