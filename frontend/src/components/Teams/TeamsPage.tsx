import React, { useState } from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useTeams } from '../../contexts/TeamContext';
import TeamList from './TeamList';
import TeamForm from './TeamForm';

const TeamsPage: React.FC = () => {
  const { loading } = useTeams();
  const [editingTeam, setEditingTeam] = useState<string | null>(null);

  return (
    <div className={styles.managementContainer}>
      <div className={styles.managementWrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Team Management</h1>
          <p className={styles.pageSubtitle}>
            Create, edit, and manage your teams and players. Build your roster, track performance, and organize your sports organization with ease.
          </p>
        </div>
        
        <div className={styles.contentGrid}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⚽</span>
              {editingTeam ? 'Edit Team' : 'Add New Team'}
            </h2>
            <TeamForm editingTeamId={editingTeam} setEditingTeam={setEditingTeam} />
          </div>
          
          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📋</span>
              Teams Overview
            </h2>
            {loading ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                Loading teams...
              </div>
            ) : (
              <TeamList setEditingTeam={setEditingTeam} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;