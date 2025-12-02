'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminLecturersPage() {
  const [institutes, setInstitutes] = useState([]);
  const [lecturersByInstitute, setLecturersByInstitute] = useState({});
  const [expandedInstitutes, setExpandedInstitutes] = useState({});
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [formData, setFormData] = useState({
    lecturer_id: '',
    name: '',
    nic: '',
    email: '',
    contact: '',
    address: '',
    department: '',
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
      data.forEach((inst) => fetchLecturers(inst.name));
    } catch (err) {
      console.error('Error fetching institutes:', err);
      alert('Error fetching institutes');
    }
  };

  const fetchLecturers = async (instituteName) => {
    try {
      const encoded = encodeURIComponent(instituteName);
      const res = await fetch(`http://localhost:5000/api/lecturers/by-institute/${encoded}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setLecturersByInstitute((prev) => ({
        ...prev,
        [instituteName]: data || [],
      }));
    } catch (err) {
      console.error(`Error fetching lecturers for ${instituteName}:`, err);
      alert(`Error fetching lecturers for ${instituteName}`);
    }
  };

  const toggleInstitute = (name) => {
    setExpandedInstitutes((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleDeleteLecturer = async (id, institute) => {
    if (!confirm('Are you sure you want to delete this lecturer?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/lecturers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      alert('Lecturer deleted successfully.');
      fetchLecturers(institute);
    } catch (err) {
      alert('Error deleting lecturer.');
      console.error(err);
    }
  };

  const startEditing = (lecturer) => {
    setEditingLecturer(lecturer.id);
    setFormData({ ...lecturer });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cancelEditing = () => {
    setEditingLecturer(null);
    setFormData({
      lecturer_id: '',
      name: '',
      nic: '',
      email: '',
      contact: '',
      address: '',
      department: '',
      institute: '',
    });
    setSuccessMessage('');
  };

  const handleSaveLecturer = async (e) => {
    e.preventDefault();
    const { lecturer_id, name, nic, email, contact, address, department, institute } = formData;
    if (!lecturer_id || !name || !nic || !email || !contact || !address || !department || !institute) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const url = `http://localhost:5000/api/lecturers/${editingLecturer}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());
      setSuccessMessage('✅ Lecturer updated successfully!');
      await fetchLecturers(institute);
      cancelEditing();
    } catch (err) {
      alert('Error saving lecturer.');
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">Manage Lecturers by Institute</h1>

          {editingLecturer && (
            <div className="bg-white p-4 rounded shadow-md mb-6 max-w-xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Update Lecturer</h2>
              {successMessage && <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>}

              <form onSubmit={handleSaveLecturer}>
                {['lecturer_id', 'name', 'nic', 'email', 'contact', 'address', 'department', 'institute'].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block text-gray-700 capitalize">{field.replace('_', ' ')}</label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-400 rounded"
                      required
                      disabled={field === 'institute'}
                    />
                  </div>
                ))}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Update Lecturer
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

          {institutes.map((inst) => (
            <div key={inst.id} className="mb-6">
              <button
                onClick={() => toggleInstitute(inst.name)}
                className="w-full bg-white hover:bg-blue-100 text-left text-xl font-semibold text-blue-800 px-6 py-3 rounded shadow mb-2 transition-all"
              >
                {expandedInstitutes[inst.name] ? '▼' : '▶'} {inst.name}
              </button>

              {expandedInstitutes[inst.name] && (
                <div className="bg-white p-4 rounded shadow-md">
                  {lecturersByInstitute[inst.name]?.length > 0 ? (
                    <table className="w-full table-auto border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-100 text-sm">
      <th className="border px-3 py-2">Lecturer ID</th>
      <th className="border px-3 py-2">Name</th>
      <th className="border px-3 py-2">NIC</th>
      <th className="border px-3 py-2">Email</th>
      <th className="border px-3 py-2">Contact</th>
      <th className="border px-3 py-2">Address</th>
      <th className="border px-3 py-2">Department</th>
      <th className="border px-3 py-2">Actions</th>
    </tr>
  </thead>
  <tbody className="text-sm">
    {lecturersByInstitute[inst.name].map((lect) => (
      <tr key={lect.id}>
        <td className="border px-3 py-1">{lect.lecturer_id}</td>
        <td className="border px-3 py-1">{lect.name}</td>
        <td className="border px-3 py-1">{lect.nic}</td>
        <td className="border px-3 py-1">{lect.email}</td>
        <td className="border px-3 py-1">{lect.contact}</td>
        <td className="border px-3 py-1">{lect.address}</td>
        <td className="border px-3 py-1">{lect.department}</td>
        <td className="border px-3 py-1">
          <button
            onClick={() => startEditing(lect)}
            className="bg-green-300 text-black px-2 py-1 rounded mr-2"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteLecturer(lect.id, inst.name)}
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
                    <p className="text-gray-500">No lecturers found for this institute.</p>
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
