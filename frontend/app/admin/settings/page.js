'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null); // initially null
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  useEffect(() => {
    // simulate fetch
    setSettings({
      adminName: 'Safeeya Munawwar',
      email: 'shafiyasha@gmail.com.com',
      contact: '0750906149',
      notifications: true,
    });
  }, []);

  if (!settings) {
    // Wait for client-side hydration
    return (
      <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
        <AdminSidebar />
        <div className="flex-1">
          <AdminTopbar />
          <div className="ml-64 mt-16 p-6 bg-gray-300 min-h-screen text-gray-900">
            <div className="text-center text-gray-700 text-lg">Loading settings...</div>
          </div>
        </div>
      </div>
    );
  }

  const updateField = (field) => {
    setSettings((prev) => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
    setSuccessMessage(`✅ ${field === 'adminName' ? 'Name' : field} updated`);
  };

  const handlePasswordUpdate = () => {
    if (password.trim()) {
      setShowPasswordInput(false);
      setPassword('');
      setSuccessMessage('✅ Password updated');
    }
  };

  const handleToggle = () => {
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }));
    setSuccessMessage(`✅ Notifications ${settings.notifications ? 'disabled' : 'enabled'}`);
  };

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
    setSuccessMessage(`✅ ${darkMode ? 'Light' : 'Dark'} mode enabled`);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className={`ml-64 mt-16 p-6 min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-900'}`}>
          <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

          {successMessage && (
            <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
          )}

          <div className={`p-6 rounded shadow-md max-w-xl mx-auto space-y-6 text-base ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            {['adminName', 'email', 'contact'].map((field) => (
              <div key={field}>
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>
                    {field === 'adminName' ? 'Admin Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  {editingField === field ? (
                    <input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onBlur={() => updateField(field)}
                      onKeyDown={(e) => e.key === 'Enter' && updateField(field)}
                      autoFocus
                      className="ml-4 px-2 py-1 border-b border-blue-400 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingField(field);
                        setTempValue(settings[field]);
                        setSuccessMessage('');
                      }}
                      className={`ml-4 cursor-pointer hover:underline ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                    >
                      {settings[field] || 'Click to edit'}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Notifications Toggle */}
            <div className="flex justify-between items-center mt-4">
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>Enable Notifications</span>
              <div
                onClick={handleToggle}
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
            <div className="flex justify-between items-center mt-4">
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

            <div>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} block font-semibold mb-1`}>Change Password</span>
              {showPasswordInput ? (
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordUpdate()}
                    className="flex-1 px-4 py-2 border border-gray-400 rounded"
                    placeholder="New password"
                  />
                  <button
                    onClick={handlePasswordUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPasswordInput(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Change Password
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
