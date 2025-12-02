'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminSidebar from '../../../../../components/LecturerSidebar';
import AdminTopbar from '../../../../../components/LecturerTopbar';

export default function DepartmentsPage() {
  const { instituteSlug } = useParams();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const slugToTitle = (slug) =>
    slug
      ?.split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  useEffect(() => {
    async function fetchDepartments() {
      try {
        setLoading(true);

        const instituteName = slugToTitle(instituteSlug);
        const encoded = encodeURIComponent(instituteName);

        const res = await fetch(`http://localhost:5000/api/departments/by-institute/${encoded}`);
        if (!res.ok) throw new Error('Failed to fetch departments');

        const data = await res.json();
        setDepartments(data.departments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDepartments();
  }, [instituteSlug]);

  if (loading) return <p className="p-6">Loading departments...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (departments.length === 0) return <p className="p-6">No departments found.</p>;

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">
            Departments - {slugToTitle(instituteSlug)}
          </h1>

          {/* Departments table */}
          <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Department Name</th>
                <th className="border px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{dept.name}</td>
                  <td className="border px-4 py-2">{dept.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
