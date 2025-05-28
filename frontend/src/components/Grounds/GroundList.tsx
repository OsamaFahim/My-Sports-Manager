import React from 'react';
import styles from '../MainPage/MainPage.module.css';
import { useGrounds } from '../../contexts/GroundContext';

interface GroundListProps {
  setEditingGroundId: (id: string | null) => void;
}

const GroundList: React.FC<GroundListProps> = ({ setEditingGroundId }) => {
  const { grounds, deleteGround } = useGrounds();

  if (grounds.length === 0) return <p>No grounds added yet.</p>;

  return (
    <ul style={{ padding: 0, listStyle: 'none' }}>
      {grounds.map(ground => (
        <li key={ground._id} className={styles.formGroup} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>
            <strong>{ground.name}</strong> | Location: {ground.location} | Capacity: {ground.capacity} | Facilities: {ground.facilities}
          </span>
          <span>
            <button
              className={styles.authLink}
              style={{ marginRight: 8 }}
              onClick={() => setEditingGroundId(ground._id!)}
            >
              Edit
            </button>
            <button
              className={styles.authLink}
              style={{ color: '#ff4d4d' }}
              onClick={() => deleteGround(ground._id!)}
            >
              Delete
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default GroundList;