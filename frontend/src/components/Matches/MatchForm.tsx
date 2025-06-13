import React, { useState, useEffect } from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useMatches } from '../../contexts/MatchContext';
import { useTeams } from '../../contexts/TeamContext';
import { useGrounds } from '../../contexts/GroundContext';
import {
  validateMatchForm,
  MatchFormValues,
  ValidationResult,
} from '../../utils/Validations/MatchValidation';

interface MatchFormProps {
  editingMatchId: string | null;
  setEditingMatchId: (id: string | null) => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ editingMatchId, setEditingMatchId }) => {
  const { matches, addMatch, updateMatch, loading } = useMatches();
  const { teams } = useTeams();
  const { grounds } = useGrounds();

  const [form, setForm] = useState<MatchFormValues>({
    teamA: '',
    teamB: '',
    ground: '',
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MatchFormValues | 'time' | 'ground', string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = Boolean(editingMatchId);

  useEffect(() => {
    if (editingMatchId) {
      const match = matches.find(m => m._id === editingMatchId);
      if (match) {
        const dt = new Date(match.datetime);
        setForm({
          teamA: match.teamA,
          teamB: match.teamB,
          ground: match.ground,
          date: dt.toISOString().slice(0, 10),
          time: dt.toTimeString().slice(0, 5),
        });
      }
    } else {
      setForm({ teamA: '', teamB: '', ground: '', date: '', time: '' });
      setErrors({});
      setSubmitError(null);
    }
  }, [editingMatchId, matches]);

  // Always clear error on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation: ValidationResult = validateMatchForm(form);
    setErrors(validation.errors);
    setSubmitError(null);

    if (!validation.isValid) return;
    try {
      if (isEditing && editingMatchId) {
        await updateMatch(editingMatchId, form);
        setEditingMatchId(null);
      } else {
        await addMatch(form);
      }
      setForm({ teamA: '', teamB: '', ground: '', date: '', time: '' });
      setSubmitError(null); // Clear error on success
    } catch (err: unknown) {
      // --- Updated error handling for backend field errors ---
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as any).response?.data?.errors
      ) {
        setErrors((err as any).response.data.errors);
        setSubmitError(null);
      } else {
        const errorMessage =
          (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (err as { message?: string })?.message ||
          'Failed to save match. Please try again.';
        setSubmitError(errorMessage);
      }
    }
  };

  if (!grounds || grounds.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🏟️</div>
        <h3 className={styles.emptyTitle}>No Grounds Available</h3>
        <p className={styles.emptyDescription}>
          No grounds are registered for now. Please add a ground before scheduling a match.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>🏆</span>
          Team A
        </label>
        <select
          name="teamA"
          value={form.teamA}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Select Team A</option>
          {teams.map(team => (
            <option key={team._id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
        {errors.teamA && <div className={styles.errorMessage}>{errors.teamA}</div>}
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>🏆</span>
          Team B
        </label>
        <select
          name="teamB"
          value={form.teamB}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Select Team B</option>
          {teams.map(team => (
            <option key={team._id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
        {errors.teamB && <div className={styles.errorMessage}>{errors.teamB}</div>}
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>🏟️</span>
          Ground
        </label>
        <select
          name="ground"
          value={form.ground}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Select Ground</option>
          {grounds.map(ground => (
            <option key={ground._id} value={ground.name}>
              {ground.name}
            </option>
          ))}
        </select>
        {errors.ground && <div className={styles.errorMessage}>{errors.ground}</div>}
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>📅</span>
          Date
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className={styles.input}
        />
        {errors.date && <div className={styles.errorMessage}>{errors.date}</div>}
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>⏰</span>
          Time
        </label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          className={styles.input}
        />
        {/* Show backend or frontend time error below Time field */}
        {errors.time && <div className={styles.errorMessage}>{errors.time}</div>}
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.submitButton} type="submit" disabled={loading}>
          {isEditing ? 'Update Match' : 'Schedule Match'}
        </button>
        {isEditing && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => setEditingMatchId(null)}
          >
            Cancel
          </button>
        )}
      </div>
      {/* Show general submit error below the button group */}
      {submitError && <div className={styles.errorMessage}>{submitError}</div>}
    </form>
  );
};

export default MatchForm;