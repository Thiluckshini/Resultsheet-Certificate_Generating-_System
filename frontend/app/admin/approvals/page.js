'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopbar from "../../../components/AdminTopbar";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function AdminApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovals() {
      try {
        const response = await fetch("/api/admin/approvals"); // Modify API endpoint if needed
        if (!response.ok) {
          throw new Error('Failed to fetch approvals');
        }
        const data = await response.json();
        console.log('Fetched Approvals:', data);
        setApprovals(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        alert('Error fetching data');
      }
    }
    fetchApprovals();
  }, []);

  const handleApprove = async (approvalId) => {
    const response = await fetch(`/api/admin/approvals/${approvalId}/approve`, {
      method: 'POST',
    });

    if (response.ok) {
      setApprovals((prevApprovals) => prevApprovals.filter((approval) => approval.id !== approvalId));
      alert('Approval granted successfully.');
    } else {
      alert('Failed to approve.');
    }
  };

  const handleReject = async (approvalId) => {
    const response = await fetch(`/api/admin/approvals/${approvalId}/reject`, {
      method: 'POST',
    });

    if (response.ok) {
      setApprovals((prevApprovals) => prevApprovals.filter((approval) => approval.id !== approvalId));
      alert('Approval rejected.');
    } else {
      alert('Failed to reject.');
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Admin Approvals</h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-md">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left text-lg font-semibold">Requestor Name</th>
                    <th className="py-3 px-6 text-left text-lg font-semibold">Request Type</th>
                    <th className="py-3 px-6 text-left text-lg font-semibold">Date</th>
                    <th className="py-3 px-6 text-left text-lg font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-3 px-6 text-center text-lg">No pending approvals.</td>
                    </tr>
                  ) : (
                    approvals.map((approval) => (
                      <tr key={approval.id} className="border-b">
                        <td className="py-3 px-6">{approval.requestorName}</td>
                        <td className="py-3 px-6">{approval.requestType}</td>
                        <td className="py-3 px-6">{approval.date}</td>
                        <td className="py-3 px-6 flex space-x-4">
                          <button
                            onClick={() => handleApprove(approval.id)}
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-md"
                          >
                            <FaCheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(approval.id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md"
                          >
                            <FaTimesCircle size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
