import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Management/ManagementPages.module.css';
import NotificationList from './NotificationList';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

const NotificationsPage: React.FC = () => {
  const { notifications, markAllAsSeen } = useNotifications();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Mark all as seen when page is loaded and authenticated
  useEffect(() => {
    if (isAuthenticated) {
      markAllAsSeen();
    }
  }, [isAuthenticated, markAllAsSeen]);

  const formattedNotifications = notifications.map((n: any) => ({
    id: n.id || n._id || String(Math.random()),
    message: n.message || n.text || '',
    date: n.date || n.createdAt || '',
  }));

  if (!isAuthenticated) return null;

  return (
    <div className={styles.managementContainer}>
      <div className={styles.managementWrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Notification Center</h1>
          <p className={styles.pageSubtitle}>
            Stay updated with the latest notifications about your bookings and grounds.
          </p>
        </div>
        <div className={styles.centeredContentGrid}>
          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🔔</span>
              Notifications
            </h2>
            <NotificationList notifications={formattedNotifications} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;