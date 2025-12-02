'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';

export default function EditProfilePage() {
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    bio1: '',
    bio2: '',
    bio3: '',
    profilePicture: '',
  });

  useEffect(() => {
    async function fetchAdminDetails() {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        setAdmin(data);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      }
    }
    fetchAdminDetails();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(admin),
      });

      if (res.ok) {
        alert('Profile updated successfully!');
        window.location.href = '/admin/profile';
      } else {
        alert('Update failed.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Edit Admin Profile</h1>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <label>
                <span className="font-medium">Name</span>
                <input
                  type="text"
                  name="name"
                  value={admin.name}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </label>

              <label>
                <span className="font-medium">Email</span>
                <input
                  type="email"
                  name="email"
                  value={admin.email}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </label>

              <label>
                <span className="font-medium">Phone</span>
                <input
                  type="text"
                  name="phone"
                  value={admin.phone}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </label>

              {[1, 2, 3, 4].map((i) => (
                <label key={i}>
                  <span className="font-medium">{i === 1 ? 'About' : `Bio ${i - 1}`}</span>
                  <textarea
                    name={`bio${i === 1 ? '' : i - 1}`}
                    value={admin[`bio${i === 1 ? '' : i - 1}`]}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                  ></textarea>
                </label>
              ))}

              <label>
                <span className="font-medium">Profile Picture URL</span>
                <input
                  type="text"
                  name="profilePicture"
                  value={admin.profilePicture}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                />
              </label>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 py-2 px-6 rounded-md text-white transition duration-300 transform hover:scale-105"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/admin/profile'}
                className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded transition duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
