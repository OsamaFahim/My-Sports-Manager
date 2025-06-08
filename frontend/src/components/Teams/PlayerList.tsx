import React from 'react';
import { Team, Player } from '../../contexts/TeamContext';
import styles from '../Management/ManagementPages.module.css';
import { deletePlayer } from '../../services/TeamService';
import { useTeams } from '../../contexts/TeamContext';

interface PlayerListProps {
  team: Team;
  onEditPlayer?: (player: Player) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ team, onEditPlayer }) => {
  const { fetchTeams } = useTeams();

  const handleDelete = async (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      await deletePlayer(team._id!, playerId);
      await fetchTeams();
    }
  };
  return (
    <div className={styles.playersList}>
      {team.players.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h4 className={styles.emptyTitle}>No Players Yet</h4>
          <p className={styles.emptyDescription}>Add players to this team to get started.</p>
        </div>
      )}
      {team.players.map(player => (
        <div key={player._id} className={styles.playerCard}>
          <div className={styles.playerInfo}>
            <div className={styles.playerName}>{player.name}</div>
            <div className={styles.playerStats}>
              Age: {player.age} | Position: {player.position} | Stats: {player.stats}
            </div>
          </div>
          <div className={styles.listItemActions}>
            <button
              className={`${styles.actionButton} ${styles.editButton}`}
              onClick={() => onEditPlayer && onEditPlayer(player)}
            >
              ✏️ Edit
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => handleDelete(player._id!)}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;