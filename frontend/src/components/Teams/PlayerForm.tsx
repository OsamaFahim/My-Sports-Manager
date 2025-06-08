import React, { useState, useEffect } from 'react';
import styles from '../Management/ManagementPages.module.css';
import { addPlayer, updatePlayer } from '../../services/TeamService';
import { useTeams } from '../../contexts/TeamContext';
import { Player } from '../../contexts/TeamContext';

interface PlayerFormProps {
  teamId: string;
  onDone: () => void;
  editingPlayer?: Player | null;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ teamId, onDone, editingPlayer }) => {
  const [form, setForm] = useState({ name: '', age: '', position: '', stats: '' });
  const { fetchTeams } = useTeams();

  useEffect(() => {
    if (editingPlayer) {
      setForm({
        name: editingPlayer.name,
        age: editingPlayer.age.toString(),
        position: editingPlayer.position,
        stats: editingPlayer.stats,
      });
    } else {
      setForm({ name: '', age: '', position: '', stats: '' });
    }
  }, [editingPlayer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer && editingPlayer._id) {
      // Update existing player
      await updatePlayer(teamId, editingPlayer._id, {
        name: form.name,
        age: Number(form.age),
        position: form.position,
        stats: form.stats,
      });
    } else {
      // Add new player
      await addPlayer(teamId, {
        name: form.name,
        age: Number(form.age),
        position: form.position,
        stats: form.stats,
      });
    }
    await fetchTeams();
    onDone();
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>👤</span>
          Name
        </label>
        <input 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          required 
          className={styles.input}
          placeholder="Enter player name"
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>🎂</span>
          Age
        </label>
        <input 
          name="age" 
          value={form.age} 
          onChange={handleChange} 
          required 
          className={styles.input} 
          type="number" 
          min="1"
          placeholder="Enter player age"
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>⚽</span>
          Position
        </label>
        <input 
          name="position" 
          value={form.position} 
          onChange={handleChange} 
          required 
          className={styles.input}
          placeholder="Enter player position"
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>📊</span>
          Stats
        </label>
        <input 
          name="stats" 
          value={form.stats} 
          onChange={handleChange} 
          required 
          className={styles.input}
          placeholder="Enter player statistics"
        />
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.submitButton} type="submit">
          {editingPlayer ? 'Update Player' : 'Add Player'}
        </button>
        {editingPlayer && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onDone}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PlayerForm;