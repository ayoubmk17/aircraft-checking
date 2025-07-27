import React, { useEffect, useState } from 'react';
import { getNotifications } from '../services/api';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map(n => (
          <li key={n.id}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
} 