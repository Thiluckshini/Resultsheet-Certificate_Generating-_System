'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import StudentSidebar from "../../../../../components/StudentSidebar";
import StudentTopbar from "../../../../../components/StudentTopbar";

export default function StudentProfile() {
  const router = useRouter();
  const { instituteSlug, departmentSlug } = useParams();

  const [student, setStudent] = useState(null);
  const [editingPicture, setEditingPicture] = useState(false);
  const [newPicture, setNewPicture] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('student');
    if (!stored) {
      router.push('/student/login');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored student data:", e);
      router.push('/student/login');
      return;
    }

    if (
      parsed.institute_slug !== instituteSlug ||
      parsed.department_slug !== departmentSlug
    ) {
      router.push('/student/login');
      return;
    }

    setStudent(parsed);
  }, [instituteSlug, departmentSlug, router]);

  function capitalizeWords(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

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
    setStudent(prev => {
      const updated = { ...prev, pictureUrl: newPicture };
      sessionStorage.setItem('student', JSON.stringify(updated));
      return updated;
    });
    setEditingPicture(false);
    setNewPicture(null);
  }

  function handleCancelPicture() {
    setEditingPicture(false);
    setNewPicture(null);
  }

  const friendlyDepartmentName = capitalizeWords(departmentSlug);
  const friendlyInstituteName = capitalizeWords(instituteSlug);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <StudentSidebar />
      <div className="flex-1">
        <StudentTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-6">{friendlyInstituteName} - Student Profile</h1>

          <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
            <div className="flex space-x-6 items-center">
              {/* Student Picture */}
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-600 bg-gray-200 flex items-center justify-center text-gray-400">
  {newPicture || student.pictureUrl ? (
    <img
      src={newPicture || student.pictureUrl}
      alt={`${student.name}'s profile picture`}
      className="object-cover w-full h-full"
    />
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-24 h-24"
      aria-hidden="true"
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

  {/* Buttons container */}
  <div className="absolute bottom-2 right-2 flex space-x-2 z-20">
    {!editingPicture && (
      <button
        onClick={handleEditClick}
        className="bg-green-600 text-white p-2 rounded-full hover:bg-blue-700 transition flex items-center justify-center"
        aria-label="Edit profile picture"
      >
        {/* Edit Icon */}
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
          aria-label="Save new profile picture"
        >
          {/* Save Icon */}
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
          aria-label="Cancel editing profile picture"
        >
          {/* Cancel (X) Icon */}
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


              {/* Student Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{student.name}</h2>
                <p className="text-gray-700 mb-4">{friendlyDepartmentName} Department</p>

                <div className="grid grid-cols-2 gap-4 text-gray-800">
                  <div>
                    <p><strong>Institute:</strong></p>
                    <p>{friendlyInstituteName}</p>
                  </div>

                  <div>
                    <p><strong>Department:</strong></p>
                    <p>{friendlyDepartmentName}</p>
                  </div>

                  <div>
                    <p><strong>Course:</strong></p>
                    <p>{friendlyDepartmentName}</p>
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
