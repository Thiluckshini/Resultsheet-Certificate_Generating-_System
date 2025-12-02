'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import LecturerSidebar from '@/components/InstituteAdminSidebar';
import LecturerTopbar from '@/components/InstituteAdminTopbar';

export default function LecturerProfilePage() {
  const { instituteSlug, departmentSlug } = useParams();

  // Dummy lecturer data instead of loading from sessionStorage
  const [lecturer, setLecturer] = useState({
    id: 'A001',
    name: 'John Does',
    pictureUrl: '', // empty to show default icon
    institute_slug: instituteSlug || 'Edu Lanka Institute',
  });

  const [editingPicture, setEditingPicture] = useState(false);
  const [newPicture, setNewPicture] = useState(null);

  const fileInputRef = useRef(null);

  function toTitleCase(str) {
    return str
      ? str
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : '';
  }

  const instituteName = toTitleCase(lecturer.institute_slug);
  const departmentName = toTitleCase(lecturer.department_slug);

  function handleEditClick() {
    setEditingPicture(true);
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPicture(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSavePicture() {
    setLecturer((prev) => {
      const updated = { ...prev, pictureUrl: newPicture };
      return updated;
    });
    setEditingPicture(false);
    setNewPicture(null);
  }

  function handleCancelPicture() {
    setEditingPicture(false);
    setNewPicture(null);
  }

  return (
    <div className="flex h-screen">
      <LecturerSidebar />
      <div className="flex-1">
        <LecturerTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">{instituteName} - Institute Admin Profile</h1>

          <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
            <div className="flex space-x-6 items-center">
              {/* Profile Picture */}
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-600 bg-gray-200 flex items-center justify-center text-gray-400">
                {newPicture || lecturer.pictureUrl ? (
                  <img
                    src={newPicture || lecturer.pictureUrl}
                    alt={`${lecturer.name}'s profile picture`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-24 h-24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="absolute bottom-2 right-2 flex space-x-2 z-20">
                  {!editingPicture && (
                    <button
                      onClick={handleEditClick}
                      className="bg-green-600 text-white p-2 rounded-full hover:bg-blue-700 transition flex items-center justify-center"
                      aria-label="Edit profile picture"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536M16.768 4.768a2.121 2.121 0 013 3L7 20H4v-3L16.768 4.768z"
                        />
                      </svg>
                    </button>
                  )}

                  {editingPicture && (
                    <>
                      <button
                        onClick={handleSavePicture}
                        className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-green-700 transition flex items-center space-x-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          className="w-5 h-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelPicture}
                        className="bg-red-400 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition flex items-center space-x-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          className="w-5 h-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Lecturer Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{lecturer.name}</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-800">
                  <div>
                    <p>
                      <strong>Institute:</strong>
                    </p>
                    <p>{instituteName}</p>
                  </div>
                  
                  <div>
                    <p>
                      <strong>Admin ID:</strong>
                    </p>
                    <p>{lecturer.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
