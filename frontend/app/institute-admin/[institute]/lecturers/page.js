'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../../../components/InstituteAdminSidebar';
import AdminTopbar from '../../../../components/InstituteAdminTopbar';

export default function LecturersPage() {
  const { institute: encodedInstitute } = useParams();
  const decodedInstitute = decodeURIComponent(encodedInstitute);
  const [departments, setDepartments] = useState([]);


  const [lecturers, setLecturers] = useState([]);
  const [newLecturer, setNewLecturer] = useState({
    lecturer_id: '',
    name: '',
    nic: '',
    email: '',
    contact: '',
    address: '',
    department: '',
    institute: decodedInstitute, // Always sync with current institute
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingLecturerId, setEditingLecturerId] = useState(null);

  useEffect(() => {
    if (decodedInstitute) {
      fetchLecturers();
      fetchDepartments(); // fetch departments list here
      setNewLecturer((prev) => ({ ...prev, institute: decodedInstitute }));
      setIsEditing(false);
      setEditingLecturerId(null);
      setSuccessMessage('');
    }
  }, [decodedInstitute]);
  
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/departments/by-institute/${encodedInstitute}`);
      if (!response.ok) throw new Error(await response.text());
  
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Error fetching departments');
    }
  };
  

  const fetchLecturers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/lecturers/by-institute/${encodedInstitute}`);

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      setLecturers(data || []);

    } catch (error) {
      alert('Error fetching lecturers.');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLecturer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLecturer = async (e) => {
    e.preventDefault();

    const { lecturer_id, name, nic, email, contact, address, department } = newLecturer;
    if (!lecturer_id || !name || !nic || !email || !contact || !address || !department) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:5000/api/lecturers/${editingLecturerId}`
        : 'http://localhost:5000/api/lecturers';
      const method = isEditing ? 'PUT' : 'POST';

      // Ensure institute is included and correct
      const lecturerToSave = { ...newLecturer, institute: decodedInstitute };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lecturerToSave),
      });

      if (!response.ok) throw new Error(await response.text());

      setSuccessMessage(isEditing ? '✅ Lecturer updated successfully!' : '✅ Lecturer added successfully!');

      setNewLecturer({
        lecturer_id: '',
        name: '',
        nic: '',
        email: '',
        contact: '',
        address: '',
        department: '',
        institute: decodedInstitute,
      });
      setIsEditing(false);
      setEditingLecturerId(null);

      fetchLecturers();
    } catch (error) {
      alert('Error saving lecturer.');
      console.error('Error saving lecturer:', error);
    }
  };

  const handleEditLecturer = (lecturer) => {
    // lecturer.id must be numeric or string, depending on your backend model
    setNewLecturer({
      lecturer_id: lecturer.lecturer_id || '',
      name: lecturer.name || '',
      nic: lecturer.nic || '',
      email: lecturer.email || '',
      contact: lecturer.contact || '',
      address: lecturer.address || '',
      department: lecturer.department || '',
      institute: lecturer.institute || decodedInstitute,
    });
    setIsEditing(true);
    setEditingLecturerId(lecturer.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteLecturer = async (id) => {
    if (!confirm('Are you sure you want to delete this lecturer?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/lecturers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(await response.text());

      alert('Lecturer deleted successfully.');
      fetchLecturers();
    } catch (error) {
      alert('Error deleting lecturer.');
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">
            Lecturer Management - {decodedInstitute}
          </h1>

          {/* Lecturer Form */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Update Lecturer' : 'Add New Lecturer'}
            </h2>
            {successMessage && (
              <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
            )}
            <form onSubmit={handleAddLecturer}>
  {/* Render text inputs */}
  {['lecturer_id', 'name', 'nic', 'email', 'contact', 'address'].map((field) => (
    <div className="mb-4" key={field}>
      <label className="block text-gray-700 capitalize">{field.replace('_', ' ')}</label>
      <input
        type="text"
        name={field}
        value={newLecturer[field]}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-400 rounded"
        required
      />
    </div>
  ))}

  {/* Render department select separately */}
  <div className="mb-4">
    <label className="block text-gray-700 capitalize">Department</label>
    <select
      name="department"
      value={newLecturer.department}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-400 rounded"
      required
    >
      <option value="">Select Department</option>
      {departments.map((dept) => (
        <option key={dept.id} value={dept.name}>
          {dept.name}
        </option>
      ))}
    </select>
  </div>

  {/* Submit and Cancel Buttons */}
  <div className="flex gap-4">
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    >
      {isEditing ? 'Update Lecturer' : 'Add Lecturer'}
    </button>
    {isEditing && (
      <button
        type="button"
        onClick={() => {
          setIsEditing(false);
          setEditingLecturerId(null);
          setNewLecturer({
            lecturer_id: '',
            name: '',
            nic: '',
            email: '',
            contact: '',
            address: '',
            department: '',
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

          {/* Lecturer Table */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Lecturers</h2>
            {lecturers.length > 0 ? (
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Lecturer ID</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">NIC</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Contact</th>
                    <th className="border px-4 py-2">Address</th>
                    <th className="border px-4 py-2">Department</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturers.map((lect) => (
                    <tr key={lect.id}>
                      <td className="border px-4 py-2">{lect.lecturer_id}</td>
                      <td className="border px-4 py-2">{lect.name}</td>
                      <td className="border px-4 py-2">{lect.nic}</td>
                      <td className="border px-4 py-2">{lect.email}</td>
                      <td className="border px-4 py-2">{lect.contact}</td>
                      <td className="border px-4 py-2">{lect.address}</td>
                      <td className="border px-4 py-2">{lect.department}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEditLecturer(lect)}
                          style={{
                            backgroundColor: '#90EE90',
                            color: 'black',
                            padding: '0.25rem 1rem',
                            borderRadius: '0.375rem',
                            marginRight: '0.5rem',
                          }}
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteLecturer(lect.id)}
                          style={{
                            backgroundColor: '#FF6347',
                            color: 'white',
                            padding: '0.25rem 1rem',
                            borderRadius: '0.375rem',
                          }}
                        >
                          <FaTrash size={20} />
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
        </div>
      </div>
    </div>
  );
}
