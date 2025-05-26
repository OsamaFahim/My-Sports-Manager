import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';
import { useTeams } from '../../contexts/TeamContext';
import TeamList from './TeamList';
import TeamForm from './TeamForm';

const TeamsPage: React.FC = () => {
  const { loading } = useTeams();
  const [editingTeam, setEditingTeam] = useState<string | null>(null);

  return (
    <div className={styles.authFormContainer}>
      <h2 className={styles.authTitle}>Team Management</h2>
      <p className={styles.authSubtitle}>
        Create, edit, and manage your teams and players.
      </p>
      <TeamForm editingTeamId={editingTeam} setEditingTeam={setEditingTeam} />
      {loading ? (
        <p>Loading teams...</p>
      ) : (
        <TeamList setEditingTeam={setEditingTeam} />
      )}
    </div>
  );
};

export default TeamsPage;