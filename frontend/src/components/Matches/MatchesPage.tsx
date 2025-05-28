import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';
import MatchForm from './MatchForm';
import MatchList from './MatchList';

const MatchesPage: React.FC = () => {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

  return (
    <div className={styles.authFormContainer}>
      <h2 className={styles.authTitle}>Match Management</h2>
      <p className={styles.authSubtitle}>
        Create, edit, and manage your matches.
      </p>
      <MatchForm editingMatchId={editingMatchId} setEditingMatchId={setEditingMatchId} />
      <MatchList setEditingMatchId={setEditingMatchId} />
    </div>
  );
};

export default MatchesPage;