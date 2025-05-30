import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { FaBell } from 'react-icons/fa';
import styles from './notificationBell.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NotificationBell: React.FC = () => {
  const { unseenCount } = useNotifications();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="floatingNotificationBell">
      <Link to="/notifications" className={styles.bellWrapper} title="Notifications">
        <FaBell className={styles.bellIcon} />
        {unseenCount > 0 && <span className={styles.badge}>{unseenCount}</span>}
      </Link>
    </div>
  );
};

export default NotificationBell;