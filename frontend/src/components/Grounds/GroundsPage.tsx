import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';
import { useGrounds } from '../../contexts/GroundContext';
import GroundForm from './GroundForm';
import GroundList from './GroundList';

const GroundsPage: React.FC = () => {
  const { loading } = useGrounds();
  const [editingGroundId, setEditingGroundId] = useState<string | null>(null);

  return (
    <div className={styles.authFormContainer}>
      <h2 className={styles.authTitle}>Ground Management</h2>
      <p className={styles.authSubtitle}>
        Create, edit, and manage your grounds.
      </p>
      <GroundForm editingGroundId={editingGroundId} setEditingGroundId={setEditingGroundId} />
      {loading ? (
        <p>Loading grounds...</p>
      ) : (
        <GroundList setEditingGroundId={setEditingGroundId} />
      )}
    </div>
  );
};

export default GroundsPage;