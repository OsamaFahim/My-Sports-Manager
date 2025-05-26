import React, { useState } from 'react';
import { Team, Player } from '../../contexts/TeamContext';
import PlayerList from './PlayerList';
import PlayerForm from './PlayerForm';
import styles from '../MainPage/MainPage.module.css';

const TeamDetails: React.FC<{ team: Team; close: () => void }> = ({ team, close }) => {
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setShowPlayerForm(true);
  };

  const handleDone = () => {
    setEditingPlayer(null);
    setShowPlayerForm(false);
  };

  return (
    <div style={{ marginTop: 12, background: '#181a1b', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0, color: '#00e676' }}>{team.name} Players</h4>
        <button className={styles.authLink} onClick={close}>Close</button>
      </div>
      <PlayerList team={team} onEditPlayer={handleEditPlayer} />
      <button
        className={styles.authButton}
        style={{ marginTop: 12 }}
        onClick={() => {
          setEditingPlayer(null);
          setShowPlayerForm(v => !v);
        }}
      >
        {showPlayerForm && !editingPlayer ? 'Hide Player Form' : 'Add Player'}
      </button>
      {showPlayerForm && (
        <PlayerForm
          teamId={team._id!}
          onDone={handleDone}
          editingPlayer={editingPlayer}
        />
      )}
    </div>
  );
};

export default TeamDetails;