import React, { useState } from 'react';
import { Team, Player, useTeams } from '../../contexts/TeamContext';
import PlayerList from './PlayerList';
import PlayerForm from './PlayerForm';
import styles from '../Management/ManagementPages.module.css';

const TeamDetails: React.FC<{ team: Team; close: () => void }> = ({ team, close }) => {
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const { isPublicView } = useTeams();

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setShowPlayerForm(true);
  };

  const handleDone = () => {
    setEditingPlayer(null);
    setShowPlayerForm(false);
  };

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
        <h3 className={styles.detailsTitle}>
          <span className={styles.icon}>👥</span>
          {team.name} Players
        </h3>
        <button className={styles.cancelButton} onClick={close}>
          ✕ Close
        </button>
      </div>
      
      <div className={styles.detailsContent}>
        <PlayerList team={team} onEditPlayer={handleEditPlayer} />
        
        {/* Only show add/hide player button and form for logged-in users */}
        {!isPublicView && (
          <>
            <div className={styles.detailsActions}>
              <button
                className={styles.actionButton}
                onClick={() => {
                  setEditingPlayer(null);
                  setShowPlayerForm(v => !v);
                }}
              >
                {showPlayerForm && !editingPlayer ? '📋 Hide Player Form' : '➕ Add Player'}
              </button>
            </div>
            {showPlayerForm && (
              <div className={styles.formSection}>
                <PlayerForm
                  teamId={team._id!}
                  onDone={handleDone}
                  editingPlayer={editingPlayer}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;