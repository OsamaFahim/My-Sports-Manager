import React from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useGrounds } from '../../contexts/GroundContext';

interface GroundListProps {
  setEditingGroundId: (id: string | null) => void;
}

const GroundList: React.FC<GroundListProps> = ({ setEditingGroundId }) => {
  const { grounds, deleteGround, isPublicView } = useGrounds();
  if (grounds.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🏟️</div>
        <h3 className={styles.emptyTitle}>No Grounds Added</h3>
        <p className={styles.emptyDescription}>
          {isPublicView
            ? 'No grounds have been registered yet. Check back soon!'
            : 'Add your first ground to start scheduling matches and events.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {grounds.map(ground => (
        <div key={ground._id} className={styles.listItem}>
          <div className={styles.listItemHeader}>
            <h3 className={styles.listItemTitle}>{ground.name}</h3>
            {!isPublicView && (
              <div className={styles.listItemActions}>
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => setEditingGroundId(ground._id!)}
                >
                  ✏️ Edit
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => deleteGround(ground._id!)}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
          <div className={styles.listItemInfo}>
            <p><strong>📍 Location:</strong> {ground.location}</p>
            <p><strong>👥 Capacity:</strong> {ground.capacity.toLocaleString()} people</p>
            <p><strong>🏢 Facilities:</strong> {ground.facilities}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroundList;