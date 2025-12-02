'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';
import { FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';

export default function AdminDepartmentsPage() {
  const [institutes, setInstitutes] = useState([]);
  const [departmentsByInstitute, setDepartmentsByInstitute] = useState({});
  const [expandedInstitutes, setExpandedInstitutes] = useState({});
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    institute: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/institutes');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setInstitutes(data);
      data.forEach((inst) => fetchDepartments(inst.name));
    } catch (err) {
      console.error('Error fetching institutes:', err);
      alert('Error fetching institutes');
    }
  };

  const fetchDepartments = async (instituteName) => {
    try {
      const encoded = encodeURIComponent(instituteName);
      const res = await fetch(`http://localhost:5000/api/departments/by-institute/${encoded}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDepartmentsByInstitute((prev) => ({
        ...prev,
        [instituteName]: data.departments || [],
      }));
    } catch (err) {
      console.error(`Error fetching departments for ${instituteName}:`, err);
      alert(`Error fetching departments for ${instituteName}`);
    }
  };

  const toggleInstitute = (name) => {
    setExpandedInstitutes((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleDeleteDepartment = async (id, institute) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/departments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      alert('Department deleted successfully.');
      fetchDepartments(institute);
    } catch (err) {
      alert('Error deleting department.');
      console.error(err);
    }
  };

  const startEditing = (department) => {
    setEditingDepartment(department.id);
    setFormData({ ...department });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cancelEditing = () => {
    setEditingDepartment(null);
    setFormData({ id: '', name: '', description: '', institute: '' });
    setSuccessMessage('');
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    const { name, description, institute } = formData;
    if (!name || !description || !institute) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const url = `http://localhost:5000/api/departments/${editingDepartment}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());
      setSuccessMessage('✅ Department updated successfully!');
      await fetchDepartments(institute);
      cancelEditing();
    } catch (err) {
      alert('Error saving department.');
      console.error(err);
    }
  };

  const filteredDepartmentsByInstitute = () => {
    if (!searchQuery) return departmentsByInstitute;

    const result = {};
    for (const inst in departmentsByInstitute) {
      const filtered = departmentsByInstitute[inst].filter((dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length) result[inst] = filtered;
    }
    return result;
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Manage Departments by Institute</h1>

          {/* 🔍 Search Input */}

          <div className="mb-4 flex justify-end items-center">
  <div className="w-full md:w-1/3">
    {searchOpen ? (
      <div className="relative w-full">
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
    ) : (
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 transition duration-200 w-full"
        title="Search"
      >
        <FaSearch className="text-gray-700 text-lg" />
        <span className="text-gray-700 font-medium">Search</span>
      </button>
    )}
  </div>
</div>


          {/* ✏️ Edit Form */}
          {editingDepartment && (
            <div className="bg-white p-4 rounded shadow-md mb-6 max-w-xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Update Department</h2>
              {successMessage && <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>}
              <form onSubmit={handleSaveDepartment}>
                {['name', 'description', 'institute'].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block text-gray-700 capitalize">{field}</label>
                    {field === 'description' ? (
                      <textarea
                        name={field}
                        value={formData[field] || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-400 rounded"
                        required
                      />
                    ) : (
                      <input
                        type="text"
                        name={field}
                        value={formData[field] || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-400 rounded"
                        required
                        disabled={field === 'institute'}
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-4">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Update
                  </button>
                  <button type="button" onClick={cancelEditing} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 📋 Departments Table */}
          {Object.entries(filteredDepartmentsByInstitute()).map(([instName, depts]) => (
            <div key={instName} className="mb-6">
              <button
                onClick={() => toggleInstitute(instName)}
                className="w-full bg-white hover:bg-blue-100 text-left text-xl font-semibold text-blue-800 px-6 py-3 rounded shadow mb-2 transition-all"
              >
                {expandedInstitutes[instName] ? '▼' : '▶'} {instName}
              </button>
              {expandedInstitutes[instName] && (
                <div className="bg-white p-4 rounded shadow-md">
                  {depts.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-2">Department Name</th>
                          <th className="border px-4 py-2">Description</th>
                          <th className="border px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {depts.map((dept) => (
                          <tr key={dept.id}>
                            <td className="border px-4 py-2">{dept.name}</td>
                            <td className="border px-4 py-2">{dept.description || '-'}</td>
                            <td className="border px-4 py-2">
                              <button
                                onClick={() => startEditing(dept)}
                                className="bg-green-300 text-black px-2 py-1 rounded mr-2"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteDepartment(dept.id, instName)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500">No departments found.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
