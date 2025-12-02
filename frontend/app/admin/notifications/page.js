'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopbar from "../../../components/AdminTopbar";

export default function Notifications() {
  // State to store notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alertShown, setAlertShown] = useState(false); // Prevent multiple alerts

  // Fetch notifications when the component mounts
  useEffect(() => {
    async function fetchNotifications() {
      const response = await fetch("/api/admin/notifications"); // Update API endpoint as needed
      const data = await response.json();
      setNotifications(data);

      const unread = data.filter(notification => !notification.read).length;
      setUnreadCount(unread);

      // Show alert if there are unread notifications
      if (unread > 0 && !alertShown) {
        alert(`You have ${unread} unread notifications!`);
        setAlertShown(true);
      }
    }
    
    fetchNotifications();
  }, [alertShown]); // Depend on alertShown to prevent multiple alerts

  return (
    <div className="flex h-screen">
      <AdminSidebar unreadCount={unreadCount} />
      <div className="flex-1">
        <AdminTopbar unreadCount={unreadCount} />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Notifications</h1>
          <p className="text-lg mb-4">Stay updated with the latest activities.</p>
          
          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className={`bg-white p-4 rounded shadow-md ${notification.read ? '' : 'border-l-4 border-blue-500'}`}>
                  <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                  <p className="text-black">{notification.message}</p>
                  <span className="text-gray-500 text-sm">{notification.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No new notifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
