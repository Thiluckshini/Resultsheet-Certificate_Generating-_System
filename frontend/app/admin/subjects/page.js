'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

function formatName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function AdminSubjectsPage() {
  const [subjectsByInstitute, setSubjectsByInstitute] = useState({});
  const [expandedInstitutes, setExpandedInstitutes] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    credits: '',
    institute: '',
    department: '',
    semester: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/subjects/all');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const grouped = {};
      data.forEach((subject) => {
        const inst = subject.institute?.trim() || 'Unknown Institute';
        const dept = subject.department?.trim() || 'Unknown Department';
        const sem = subject.semester?.toString().trim() || 'Unknown Semester';

        if (!grouped[inst]) grouped[inst] = {};
        if (!grouped[inst][dept]) grouped[inst][dept] = {};
        if (!grouped[inst][dept][sem]) grouped[inst][dept][sem] = [];

        grouped[inst][dept][sem].push(subject);
      });

      setSubjectsByInstitute(grouped);

      const instExpandState = {};
      Object.keys(grouped).forEach((inst) => {
        instExpandState[inst] = true;
      });
      setExpandedInstitutes(instExpandState);
      setExpandedDepartments({});
    } catch (err) {
      console.error('Error fetching subjects:', err);
      alert('Error fetching subjects');
    }
  };

  const toggleInstitute = (inst) => {
    setExpandedInstitutes((prev) => ({
      ...prev,
      [inst]: !prev[inst],
    }));
  };

  const toggleDepartment = (inst, dept) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [inst]: {
        ...(prev[inst] || {}),
        [dept]: !((prev[inst] || {})[dept]),
      },
    }));
  };

  const startEditing = (subject) => {
    setEditingSubject(subject.id);
    setFormData({ ...subject, credits: subject.credits.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSuccessMessage('');
  };

  const cancelEditing = () => {
    setEditingSubject(null);
    setFormData({
      id: '',
      name: '',
      code: '',
      credits: '',
      institute: '',
      department: '',
      semester: '',
    });
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    const { name, code, credits, semester, institute, department } = formData;

    if (!name || !code || !credits || !semester || !institute || !department) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const url = `http://localhost:5000/api/subjects/${editingSubject}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, credits: Number(credits) }),
      });

      if (!res.ok) throw new Error(await res.text());

      setSuccessMessage('✅ Subject updated successfully!');
      fetchSubjects();
      cancelEditing();
    } catch (err) {
      alert('Error saving subject.');
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Subject deleted successfully.');
      fetchSubjects();
    } catch (err) {
      alert('Error deleting subject.');
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">Subjects Management</h1>

          {editingSubject && (
            <div className="bg-white p-6 rounded shadow-md mb-6 max-w-xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Update Subject</h2>
              {successMessage && (
                <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
              )}
              <form onSubmit={handleSaveSubject}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Credits</label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    required
                  />
                </div>

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
                    Update Subject
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

          {Object.entries(subjectsByInstitute).length === 0 && <p>No subjects found.</p>}

          {Object.entries(subjectsByInstitute).map(([institute, departments]) => (
            <div key={institute} className="mb-6">
              <button
                onClick={() => toggleInstitute(institute)}
                className="w-full bg-white hover:bg-blue-100 text-left text-xl font-semibold text-blue-800 px-6 py-3 rounded shadow mb-2 transition-all"
                aria-expanded={!!expandedInstitutes[institute]}
                aria-controls={`inst-${institute}`}
                type="button"
              >
                {expandedInstitutes[institute] ? '▼' : '▶'} {formatName(institute)}
              </button>

              {expandedInstitutes[institute] && (
                <div id={`inst-${institute}`} className="bg-white p-4 rounded shadow-md">
                  {Object.entries(departments).map(([dept, semesters]) => (
                    <div key={dept} className="mb-4 border-b border-gray-300 pb-2">
                      <button
                        onClick={() => toggleDepartment(institute, dept)}
                        className="w-full text-left font-semibold text-gray-800 hover:text-blue-600"
                        aria-expanded={!!(expandedDepartments[institute]?.[dept])}
                        aria-controls={`dept-${institute}-${dept}`}
                        type="button"
                      >
                        {expandedDepartments[institute]?.[dept] ? '▼' : '▶'} Department: {formatName(dept)}
                      </button>

                      {expandedDepartments[institute]?.[dept] && (
                        <div id={`dept-${institute}-${dept}`} className="mb-6">
                          {Object.entries(semesters).map(([semester, subjects]) => (
                            <div
                              key={semester}
                              className="bg-white p-4 rounded shadow mb-4 w-full mb-4 pb-2"
                            >
                              <h4 className="font-semibold mb-2">Semester: {semester}</h4>
                              <table className="table-auto w-full mt-2 text-sm border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="border px-4 py-2 text-left">Name</th>
                                    <th className="border px-4 py-2 text-left">Code</th>
                                    <th className="border px-4 py-2 text-left">Credits</th>
                                    <th className="border px-4 py-2 text-left">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {subjects.map((subject) => (
                                    <tr key={subject.id} className="hover:bg-gray-50">
                                      <td className="border px-4 py-2">{subject.name}</td>
                                      <td className="border px-4 py-2">{subject.code}</td>
                                      <td className="border px-4 py-2">{subject.credits}</td>
                                      <td className="border px-4 py-2 text-left">
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => startEditing(subject)}
                                            className="bg-green-300 hover:bg-green-400 text-black px-3 py-1 rounded"
                                            title="Edit Subject"
                                          >
                                            <FaEdit size={18} />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteSubject(subject.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            title="Delete Subject"
                                          >
                                            <FaTrash size={18} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
