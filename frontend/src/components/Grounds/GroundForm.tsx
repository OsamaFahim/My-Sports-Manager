import React, { useState, useEffect } from 'react';
import styles from '../MainPage/MainPage.module.css';
import { useGrounds } from '../../contexts/GroundContext';

interface GroundFormProps {
  editingGroundId: string | null;
  setEditingGroundId: (id: string | null) => void;
}

const GroundForm: React.FC<GroundFormProps> = ({ editingGroundId, setEditingGroundId }) => {
  const { grounds, addGround, updateGround } = useGrounds();
  const [form, setForm] = useState({ name: '', location: '', capacity: '', facilities: '' });
  const isEditing = Boolean(editingGroundId);

  useEffect(() => {
    if (editingGroundId) {
      const ground = grounds.find(g => g._id === editingGroundId);
      if (ground) {
        setForm({
          name: ground.name,
          location: ground.location,
          capacity: ground.capacity.toString(),
          facilities: ground.facilities,
        });
      }
    } else {
      setForm({ name: '', location: '', capacity: '', facilities: '' });
    }
  }, [editingGroundId, grounds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const groundData = {
      name: form.name,
      location: form.location,
      capacity: Number(form.capacity),
      facilities: form.facilities,
    };
    if (isEditing && editingGroundId) {
      await updateGround(editingGroundId, groundData);
      setEditingGroundId(null);
    } else {
      await addGround(groundData);
    }
    setForm({ name: '', location: '', capacity: '', facilities: '' });
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <div className={styles.formGroup}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required className={styles.authInput} />
      </div>
      <div className={styles.formGroup}>
        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} required className={styles.authInput} />
      </div>
      <div className={styles.formGroup}>
        <label>Capacity</label>
        <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required className={styles.authInput} min={1} />
      </div>
      <div className={styles.formGroup}>
        <label>Facilities</label>
        <textarea name="facilities" value={form.facilities} onChange={handleChange} required className={styles.authInput} />
      </div>
      <button className={styles.authButton} type="submit">
        {isEditing ? 'Update Ground' : 'Add Ground'}
      </button>
      {isEditing && (
        <button
          type="button"
          className={styles.authLink}
          style={{ marginLeft: 16 }}
          onClick={() => setEditingGroundId(null)}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default GroundForm;