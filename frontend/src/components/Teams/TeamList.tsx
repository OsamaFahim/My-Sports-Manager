import React, { useState } from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useTeams } from '../../contexts/TeamContext';
import TeamDetails from './TeamDetails';

interface TeamListProps {
  setEditingTeam: (id: string | null) => void;
}

const TeamList: React.FC<TeamListProps> = ({ setEditingTeam }) => {
  const { teams, deleteTeam } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  if (teams.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚽</div>
        <h3 className={styles.emptyTitle}>No Teams Yet</h3>
        <p className={styles.emptyDescription}>
          Create your first team to get started with team management.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {teams.map(team => (
        <div key={team._id} className={styles.listItem}>
          <div className={styles.listItemHeader}>
            <h3 
              className={styles.listItemTitle}
              onClick={() => setSelectedTeam(selectedTeam === team._id ? null : team._id!)}
            >
              {team.name}
            </h3>
            <div className={styles.listItemActions}>
              <button
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => setEditingTeam(team._id!)}
              >
                ✏️ Edit
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => deleteTeam(team._id!)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
          <div className={styles.listItemInfo}>
            <p>Players: {team.players?.length || 0}</p>
            <p>Click on team name to view player details</p>
          </div>
          {selectedTeam === team._id && (
            <TeamDetails team={team} close={() => setSelectedTeam(null)} />
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamList;