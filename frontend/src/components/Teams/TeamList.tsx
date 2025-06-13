import React, { useState } from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useTeams } from '../../contexts/TeamContext';
import TeamDetails from './TeamDetails';

interface TeamListProps {
  setEditingTeam: (id: string | null) => void;
}

const TeamList: React.FC<TeamListProps> = ({ setEditingTeam }) => {
  const { teams, deleteTeam, isPublicView } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  if (teams.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚽</div>
        <h3 className={styles.emptyTitle}>No Teams Yet</h3>
        <p className={styles.emptyDescription}>
          {isPublicView
            ? 'No teams have been registered yet. Check back soon!'
            : 'Create your first team to get started with team management.'}
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
              style={{ cursor: 'pointer' }}
            >
              {team.name}
            </h3>
            {!isPublicView && (
              <div className={styles.listItemActions}>
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => setEditingTeam(team._id!)}
                >
                  ✏️ Edit
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this team?')) {
                      setEditingTeam(null);
                      deleteTeam(team._id!);
                    }
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          {isPublicView && (
            <button
              className = {`${styles.actionButton} ${styles.buyTicketButton}`}
              //onclick={() => ...} // Add functionality for buying tickets if needed
              >
                🎟️ Buy Ticket
              </button>
          )}
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