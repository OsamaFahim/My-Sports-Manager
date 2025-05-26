import React from 'react';
import { Team, Player } from '../../contexts/TeamContext';
import styles from '../MainPage/MainPage.module.css';
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
    <ul style={{ padding: 0, listStyle: 'none', marginTop: 8 }}>
      {team.players.length === 0 && <li>No players yet.</li>}
      {team.players.map(player => (
        <li key={player._id} className={styles.formGroup} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>
            <strong>{player.name}</strong> | Age: {player.age} | Position: {player.position} | Stats: {player.stats}
          </span>
          <span>
            <button
              className={styles.authLink}
              style={{ marginRight: 8 }}
              onClick={() => onEditPlayer && onEditPlayer(player)}
            >
              Edit
            </button>
            <button
              className={styles.authLink}
              style={{ color: '#ff4d4d' }}
              onClick={() => handleDelete(player._id!)}
            >
              Delete
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PlayerList;