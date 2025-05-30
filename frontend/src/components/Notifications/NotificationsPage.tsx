import React, { useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import styles from './notificationsPage.module.css';

const NotificationsPage: React.FC = () => {
  const { notifications, loading, markAllAsSeen } = useNotifications();

  useEffect(() => {
    markAllAsSeen();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notifications</h2>
      {loading ? (
        <div>Loading...</div>
      ) : notifications.length === 0 ? (
        <div className={styles.empty}>No notifications yet.</div>
      ) : (
        <ul className={styles.list}>
          {notifications.map(n => (
            <li key={n._id} className={n.seen ? styles.seen : styles.unseen}>
              <div className={styles.message}>{n.message}</div>
              <div className={styles.date}>
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;