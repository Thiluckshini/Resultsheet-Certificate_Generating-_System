'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopbar from "../../../components/AdminTopbar";
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState([]);
  const [newInstitute, setNewInstitute] = useState({
    name: '',
    location: '',
    establishedYear: '',
    logo: null,
  });
  const [editingInstitute, setEditingInstitute] = useState(null); // New state to store the institute being edited
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/institutes");

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      setInstitutes(data);
    } catch (error) {
      alert("An error occurred while fetching institutes.");
      console.error(error);
    }
  };

  const handleAddInstitute = async (e) => {
    e.preventDefault();

    if (!newInstitute.name || !newInstitute.location || !newInstitute.establishedYear) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append('name', newInstitute.name);
    formData.append('location', newInstitute.location);
    formData.append('establishedYear', newInstitute.establishedYear);
    if (newInstitute.logo) {
      formData.append('logo', newInstitute.logo);
    }

    try {
      const response = await fetch('http://localhost:5000/api/institutes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      setSuccessMessage('✅ Institute added successfully!');
      fetchInstitutes();
      setNewInstitute({ name: '', location: '', establishedYear: '', logo: null });

      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  const handleDeleteInstitute = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/institutes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(await response.text());

      alert('Institute deleted successfully.');
      fetchInstitutes();
    } catch (error) {
      alert('An error occurred while deleting the institute.');
      console.error(error);
    }
  };

  const handleUpdateInstitute = async (e) => {
    e.preventDefault();

    if (!newInstitute.name || !newInstitute.location || !newInstitute.establishedYear) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append('name', newInstitute.name);
    formData.append('location', newInstitute.location);
    formData.append('establishedYear', newInstitute.establishedYear);
    if (newInstitute.logo) {
      formData.append('logo', newInstitute.logo);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/institutes/${editingInstitute.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      setSuccessMessage('✅ Institute updated successfully!');
      fetchInstitutes();
      setNewInstitute({ name: '', location: '', establishedYear: '', logo: null });
      setEditingInstitute(null); // Reset the editingInstitute state

      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstitute((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewInstitute((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleEditInstitute = (inst) => {
    setEditingInstitute(inst);
    setNewInstitute({
      name: inst.name,
      location: inst.location,
      establishedYear: inst.establishedYear,
      logo: null, // You can add logic to handle the current logo if you want
    });
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Institutes Management</h1>

          {/* Add or Edit Institute */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingInstitute ? 'Edit Institute' : 'Add New Institute'}
            </h2>

            {successMessage && (
              <div className="mb-4 text-green-600 font-semibold">
                {successMessage}
              </div>
            )}

            <form onSubmit={editingInstitute ? handleUpdateInstitute : handleAddInstitute}>
              {['name', 'location', 'establishedYear'].map((field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-gray-700 capitalize">{field.replace('Year', ' Year')}</label>
                  <input
                    type={field === 'establishedYear' ? 'number' : 'text'}
                    name={field}
                    value={newInstitute[field]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded"
                    required
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-gray-700">Logo</label>
                <input
                  type="file"
                  id="logoInput"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-500 rounded"
                  required={!editingInstitute} // Logo is required only when adding a new institute
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {editingInstitute ? 'Update Institute' : 'Add Institute'}
              </button>
            </form>
          </div>

          {/* Institutes List */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Institutes</h2>
            {institutes.length === 0 ? (
              <p className="text-gray-500">No institutes found.</p>
            ) : (
              <table className="min-w-full table-auto border border-gray-900 border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Logo</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Location</th>
                    <th className="border px-4 py-2">Established Year</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutes.map((inst) => (
                    <tr key={inst.id}>
                      <td className="border px-4 py-2">
                        <img
                          src={`http://localhost:5000/${inst.logoUrl}`}
                          alt={inst.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">{inst.name}</td>
                      <td className="border px-4 py-2">{inst.location}</td>
                      <td className="border px-4 py-2">{inst.establishedYear}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEditInstitute(inst)}
                          style={{
                            backgroundColor: '#90EE90',
                            color: 'black',
                            padding: '0.25rem 1rem',
                            borderRadius: '0.375rem',
                            marginRight: '0.5rem', // Add space between buttons
                            transition: 'background-color 0.3s',
                          }}
                        >
                         <FaEdit size={25} />
                        </button>
                        <button 
                          onClick={() => handleDeleteInstitute(inst.id)}
                          style={{
                            backgroundColor: '#FF6347',
                            color: 'white',
                            padding: '0.25rem 1rem',
                            borderRadius: '0.375rem',
                            transition: 'background-color 0.3s',
                          }}
                        >
                           <FaTrash size={25} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
