import React from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useMatches } from '../../contexts/MatchContext';

interface MatchListProps {
  setEditingMatchId: (id: string | null) => void;
}

const MatchList: React.FC<MatchListProps> = ({ setEditingMatchId }) => {
  const { matches, deleteMatch } = useMatches();
  if (matches.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚽</div>
        <h3 className={styles.emptyTitle}>No Matches Scheduled</h3>
        <p className={styles.emptyDescription}>
          Schedule your first match to get started with match management.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {matches.map(match => {
        const dt = new Date(match.datetime);
        const dateStr = dt.toLocaleDateString();
        const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return (
          <div key={match._id} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <h3 className={styles.listItemTitle}>
                {match.teamA} vs {match.teamB}
              </h3>
              <div className={styles.listItemActions}>
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => setEditingMatchId(match._id!)}
                >
                  ✏️ Edit
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => deleteMatch(match._id!)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            <div className={styles.listItemInfo}>
              <p><strong>🏟️ Venue:</strong> {match.ground}</p>
              <p><strong>📅 Date:</strong> {dateStr}</p>
              <p><strong>⏰ Time:</strong> {timeStr}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchList;