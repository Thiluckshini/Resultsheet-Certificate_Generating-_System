'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopbar from "../../../components/AdminTopbar";

export default function EditContact() {
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    whatsapp: '',
  });

  const [originalContactInfo, setOriginalContactInfo] = useState(null); // For cancel/reset

  useEffect(() => {
    async function fetchContactInfo() {
      const response = await fetch("/api/admin/contact");
      const data = await response.json();
      setContactInfo(data);
      setOriginalContactInfo(data); // Save original for cancel
    }
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/admin/contact/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactInfo),
    });
    const data = await response.json();
    if (data.success) {
      alert('Contact info updated!');
      setOriginalContactInfo(contactInfo); // Update backup after saving
    } else {
      alert('Error updating contact info.');
    }
  };

  const handleCancel = () => {
    if (originalContactInfo) {
      setContactInfo(originalContactInfo); // Revert changes
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Edit Contact Info</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-lg">Email</label>
              <input
                type="email"
                id="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-lg">Phone</label>
              <input
                type="tel"
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="github" className="block text-lg">GitHub</label>
              <input
                type="text"
                id="github"
                value={contactInfo.github}
                onChange={(e) => setContactInfo({ ...contactInfo, github: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-lg">LinkedIn</label>
              <input
                type="text"
                id="linkedin"
                value={contactInfo.linkedin}
                onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-lg">WhatsApp</label>
              <input
                type="text"
                id="whatsapp"
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
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
                onClick={() => window.location.href = '/admin/contact'}
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
