import React from 'react';
import styles from '../Management/ManagementPages.module.css';

interface Notification {
  id: string;
  message: string;
  date: string;
}

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  if (notifications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🔔</div>
        <h3 className={styles.emptyTitle}>No Notifications</h3>
        <p className={styles.emptyDescription}>
          You have no notifications yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {notifications.map(notification => (
        <div key={notification.id} className={styles.listItem}>
          <div className={styles.listItemHeader}>
            <h3 className={styles.listItemTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={styles.sectionIcon}>🔔</span>
              Notification
            </h3>
          </div>
          <div className={styles.listItemInfo}>
            {notification.message.split('\n').map((line, idx) =>
              line.trim() === '' ? <br key={idx} /> : <div key={idx}>{line}</div>
            )}
            <div className={styles.itemSubtitle} style={{ fontSize: '0.95rem', color: '#a0eec0', marginTop: 8 }}>
              {new Date(notification.date).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;