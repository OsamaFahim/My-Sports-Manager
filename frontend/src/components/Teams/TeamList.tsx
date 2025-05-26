import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';
import { useTeams } from '../../contexts/TeamContext';
import TeamDetails from './TeamDetails';

interface TeamListProps {
  setEditingTeam: (id: string | null) => void;
}

const TeamList: React.FC<TeamListProps> = ({ setEditingTeam }) => {
  const { teams, deleteTeam } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  if (teams.length === 0) {
    return <p>No teams yet. Add your first team!</p>;
  }

  return (
    <div>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {teams.map(team => (
          <li key={team._id} className={styles.formGroup} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{ fontWeight: 600, cursor: 'pointer', color: '#00e676' }}
                onClick={() => setSelectedTeam(team._id!)}
              >
                {team.name}
              </span>
              <div>
                <button
                  className={styles.authLink}
                  onClick={() => setEditingTeam(team._id!)}
                  style={{ marginRight: 12 }}
                >
                  Edit
                </button>
                <button
                  className={styles.authLink}
                  style={{ color: '#ff4d4d' }}
                  onClick={() => deleteTeam(team._id!)}
                >
                  Delete
                </button>
              </div>
            </div>
            {selectedTeam === team._id && (
              <TeamDetails team={team} close={() => setSelectedTeam(null)} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamList;