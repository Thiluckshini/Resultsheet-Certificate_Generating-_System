'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../../../components/InstituteAdminSidebar';
import AdminTopbar from '../../../../components/InstituteAdminTopbar';

export default function DepartmentsPage() {
  const { institute } = useParams();
  const decodedInstitute = institute ? decodeURIComponent(institute) : '';
  
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    institute: decodedInstitute,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  useEffect(() => {
    if (decodedInstitute) {
      fetchDepartments();
      // Reset form whenever institute changes
      setNewDepartment({
        name: '',
        description: '',
        institute: decodedInstitute,
      });
      setIsEditing(false);
      setEditingDepartmentId(null);
      setSuccessMessage('');
    }
  }, [decodedInstitute]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/departments/by-institute/${encodeURIComponent(decodedInstitute)}`
      );

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error('Fetch error:', error.message);
      alert(`Failed to fetch departments: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartment.name) {
      alert('Please fill in the department name.');
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:5000/api/departments/${editingDepartmentId}`
        : 'http://localhost:5000/api/departments';

      const method = isEditing ? 'PUT' : 'POST';

      // Make sure institute is always the decoded value on save
      const bodyData = { ...newDepartment, institute: decodedInstitute };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error(await response.text());

      setSuccessMessage(
        isEditing ? '✅ Department updated successfully!' : '✅ Department added successfully!'
      );

      setNewDepartment({
        name: '',
        description: '',
        institute: decodedInstitute,
      });
      setIsEditing(false);
      setEditingDepartmentId(null);

      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Failed to save department. Please try again.');
    }
  };

  const handleEditDepartment = (department) => {
    setNewDepartment({
      name: department.name,
      description: department.description,
      institute: decodedInstitute,
    });
    setIsEditing(true);
    setEditingDepartmentId(department.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDepartment = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this department?');
    if (!confirmDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/departments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(await response.text());

      alert('Department deleted successfully.');
      fetchDepartments();
    } catch (error) {
      alert('Error deleting department.');
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Department Management - {decodedInstitute}</h1>

          {/* Department Form */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Update Department' : 'Add New Department'}
            </h2>
            {successMessage && (
              <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
            )}
            <form onSubmit={handleAddDepartment}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newDepartment.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newDepartment.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  {isEditing ? 'Update Department' : 'Add Department'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingDepartmentId(null);
                      setNewDepartment({
                        name: '',
                        description: '',
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

          {/* Departments Table */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Departments</h2>
            {departments.length > 0 ? (
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td className="border px-4 py-2">{dept.name}</td>
                      <td className="border px-4 py-2">{dept.description}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEditDepartment(dept)}
                          style={{
                            backgroundColor: '#90EE90',
                            color: 'black',
                            padding: '0.25rem 1rem',
                            borderRadius: '0.375rem',
                            marginRight: '0.5rem',
                          }}
                        >
                          <FaEdit size={25} />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          style={{
                            backgroundColor: '#FF6347',
                            color: 'white',
                            padding: '0.25rem 1rem',
                            borderRadius: '0.375rem',
                          }}
                        >
                          <FaTrash size={25} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No departments found for this institute.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
