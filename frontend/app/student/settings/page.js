'use client';

import { useState, useEffect } from 'react';
import StudentSidebar from '../../../components/StudentSidebar';
import StudentTopbar from '../../../components/StudentTopbar';

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // simulate fetch of student settings
    setSettings({
      notifications: true,
    });
  }, []);

  if (!settings) {
    return (
      <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
        <StudentSidebar />
        <div className="flex-1">
          <StudentTopbar />
          <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
            <div className="text-center text-gray-700 text-lg">Loading settings...</div>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleNotifications = () => {
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }));
    setSuccessMessage(`✅ Notifications ${settings.notifications ? 'disabled' : 'enabled'}`);
  };

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
    setSuccessMessage(`✅ ${darkMode ? 'Light' : 'Dark'} mode enabled`);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
      <StudentSidebar />
      <div className="flex-1">
        <StudentTopbar />
        <div className={`ml-64 mt-16 p-6 min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-900'}`}>
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          {successMessage && (
            <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
          )}

          <div className={`p-6 rounded shadow-md max-w-xl mx-auto space-y-6 text-base ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            {/* Notifications Toggle */}
            <div className="flex justify-between items-center">
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>Enable Notifications</span>
              <div
                onClick={handleToggleNotifications}
                className={`w-14 h-8 flex items-center rounded-full cursor-pointer transition ${
                  settings.notifications ? 'bg-green-500' : 'bg-gray-400'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                    settings.notifications ? 'translate-x-6' : ''
                  }`}
                ></div>
              </div>
            </div>

            {/* Dark/Light Theme Toggle */}
            <div className="flex justify-between items-center">
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>Dark Mode</span>
              <div
                onClick={handleThemeToggle}
                className={`w-14 h-8 flex items-center rounded-full cursor-pointer transition ${
                  darkMode ? 'bg-green-500' : 'bg-gray-400'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                    darkMode ? 'translate-x-6' : ''
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
