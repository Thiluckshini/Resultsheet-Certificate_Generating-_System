'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopbar from "../../../components/AdminTopbar";
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function InstituteAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    admin_id: '',
    name: '',
    nic: '',
    email: '',
    contact: '',
    address: '',
    institute: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState(null);

  useEffect(() => {
    fetchAdmins();
    fetchInstitutes();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/institute-admins");
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      alert("An error occurred while fetching admins.");
      console.error(error);
    }
  };

  const fetchInstitutes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/institutes");
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setInstitutes(data);
    } catch (error) {
      console.error("Failed to load institutes:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const { admin_id, name, nic, email, contact, address, institute } = newAdmin;

    if (!admin_id || !name || !nic || !email || !contact || !address || !institute) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:5000/api/institute-admins/${editingAdminId}`
        : 'http://localhost:5000/api/institute-admins';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });

      if (!response.ok) throw new Error(await response.text());

      setSuccessMessage(isEditing ? '✅ Admin updated successfully!' : '✅ Admin added successfully!');
      setNewAdmin({
        admin_id: '',
        name: '',
        nic: '',
        email: '',
        contact: '',
        address: '',
        institute: '',
      });
      setIsEditing(false);
      setEditingAdminId(null);
      fetchAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
    }
  };

  const handleEditAdmin = (admin) => {
    setNewAdmin(admin);
    setIsEditing(true);
    setEditingAdminId(admin.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAdmin = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/institute-admins/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(await response.text());

      alert("Admin deleted successfully.");
      fetchAdmins();
    } catch (error) {
      alert("Error deleting admin.");
      console.error(error);
    }
  };

  const groupedAdmins = institutes.reduce((acc, inst) => {
    acc[inst.name] = admins.filter(
      (admin) => admin.institute === inst.name || admin.institute === inst.id
    );
    return acc;
  }, {});

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Institute Admins Management</h1>

          {/* Admin Form */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Update Admin' : 'Add New Institute Admin'}
            </h2>
            {successMessage && (
              <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
            )}
            <form onSubmit={handleAddAdmin}>
              {['admin_id', 'name', 'nic', 'email', 'contact', 'address'].map((field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-gray-700 capitalize">{field.replace('_', ' ')}</label>
                  <input
                    type="text"
                    name={field}
                    value={newAdmin[field]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-400 rounded"
                    required
                  />
                </div>
              ))}

              <div className="mb-4">
                <label className="block text-gray-700">Institute</label>
                <select
                  name="institute"
                  value={newAdmin.institute}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded"
                  required
                >
                  <option value="">Select Institute</option>
                  {institutes.map((inst) => (
                    <option key={inst.id} value={inst.name}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  {isEditing ? 'Update Admin' : 'Add Admin'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingAdminId(null);
                      setNewAdmin({
                        admin_id: '',
                        name: '',
                        nic: '',
                        email: '',
                        contact: '',
                        address: '',
                        institute: '',
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

          {/* Admin Table */}
          {institutes.map((institute) => (
            <div key={institute.id} className="bg-white p-4 rounded shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Admins - <span className="text-blue-600">{institute.name}</span></h2>
              {groupedAdmins[institute.name] && groupedAdmins[institute.name].length > 0 ? (
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Admin ID</th>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">NIC</th>
                      <th className="border px-4 py-2">Email</th>
                      <th className="border px-4 py-2">Contact</th>
                      <th className="border px-4 py-2">Address</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedAdmins[institute.name].map((admin) => (
                      <tr key={admin.id}>
                        <td className="border px-4 py-2">{admin.admin_id}</td>
                        <td className="border px-4 py-2">{admin.name}</td>
                        <td className="border px-4 py-2">{admin.nic}</td>
                        <td className="border px-4 py-2">{admin.email}</td>
                        <td className="border px-4 py-2">{admin.contact}</td>
                        <td className="border px-4 py-2">{admin.address}</td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => handleEditAdmin(admin)}
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
                            onClick={() => handleDeleteAdmin(admin.id)}
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
              ) : (
                <p className="text-gray-500">No admins found for this institute.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
