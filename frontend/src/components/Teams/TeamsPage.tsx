import React, { useState } from 'react';
import styles from '../Management/ManagementPages.module.css';
import TeamForm from './TeamForm';
import TeamList from './TeamList';
import { useTeams } from '../../contexts/TeamContext';

const TeamsPage: React.FC = () => {
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const { isPublicView } = useTeams();

  return (
    <div className={styles.managementContainer}>
      <div className={styles.managementWrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Team Management</h1>
          <p className={styles.pageSubtitle}>
            Build, edit, and manage your teams. Organize players, track stats, and create your dream squad!
          </p>
        </div>
        <div
          className={
            isPublicView
              ? styles.centeredContentGrid
              : styles.contentGrid
          }
        >
          {/* Only show the form to logged-in users */}
          {!isPublicView && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🏆</span>
                {editingTeam ? 'Edit Team' : 'Create New Team'}
              </h2>
              <TeamForm editingTeamId={editingTeam} setEditingTeam={setEditingTeam} />
            </div>
          )}
          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>👥</span>
              Teams
            </h2>
            <TeamList setEditingTeam={setEditingTeam} />
            {/* Public view illustration and tagline */}
            {isPublicView && (
              <>
                <img
                  src="/public_teams_illustration.svg"
                  alt="Teams Illustration"
                  className={styles.publicImage}
                  style={{ maxWidth: 120, margin: '2rem auto 1rem', display: 'block' }}
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
                {/* <div className={styles.publicTagline}>
                  <em>“Talent wins games, but teamwork wins championships.”</em>
                  <br />
                  <span style={{ fontSize: '1rem', color: '#a0eec0' }}>— Michael Jordan</span>
                </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;