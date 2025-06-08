import React, { useState } from 'react';
import styles from '../Management/ManagementPages.module.css';
import MatchForm from './MatchForm';
import MatchList from './MatchList';

const MatchesPage: React.FC = () => {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

  return (
    <div className={styles.managementContainer}>
      <div className={styles.managementWrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Match Management</h1>
          <p className={styles.pageSubtitle}>
            Create, edit, and manage your matches. Schedule tournaments, track results, and coordinate sporting events with our comprehensive match management system.
          </p>
        </div>
        
        <div className={styles.contentGrid}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🏟️</span>
              {editingMatchId ? 'Edit Match' : 'Schedule New Match'}
            </h2>
            <MatchForm editingMatchId={editingMatchId} setEditingMatchId={setEditingMatchId} />
          </div>
          
          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📅</span>
              Scheduled Matches
            </h2>
            <MatchList setEditingMatchId={setEditingMatchId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;