import React, { useState, useEffect } from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useTeams } from '../../contexts/TeamContext';

interface TeamFormProps {
  editingTeamId: string | null;
  setEditingTeam: (id: string | null) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ editingTeamId, setEditingTeam }) => {
  const { teams, addTeam, updateTeam } = useTeams();
  const [name, setName] = useState('');
  const isEditing = Boolean(editingTeamId);

  useEffect(() => {
    if (editingTeamId) {
      const team = teams.find(t => t._id === editingTeamId);
      setName(team?.name || '');
    } else {
      setName('');
    }
  }, [editingTeamId, teams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingTeamId) {
      await updateTeam(editingTeamId, { name });
      setEditingTeam(null);
    } else {
      await addTeam({ name, players: [] });
    }
    setName('');
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="teamName" className={styles.label}>
          <span className={styles.labelIcon}>⚽</span>
          Team Name
        </label>
        <input
          id="teamName"
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter team name"
          required
        />
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.submitButton} type="submit">
          {isEditing ? 'Update Team' : 'Add Team'}
        </button>
        {isEditing && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => setEditingTeam(null)}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TeamForm;