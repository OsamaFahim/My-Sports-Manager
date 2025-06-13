import React, { useState } from 'react';
import styles from '../Management/ManagementPages.module.css';
import GroundForm from './GroundForm';
import GroundList from './GroundList';
import { useGrounds } from '../../contexts/GroundContext';
import { useMatches } from '../../contexts/MatchContext';

const GroundsPage: React.FC = () => {
  const [editingGround, setEditingGround] = useState<string | null>(null);
  const { isPublicView } = useGrounds();

  return (
    <div className={styles.managementContainer}>
      <div className={styles.managementWrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Ground Management</h1>
          <p className={styles.pageSubtitle}>
            Discover, manage, and book grounds for your matches. Find the perfect venue for your next big game!
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
                <span className={styles.sectionIcon}>🏟️</span>
                {editingGround ? 'Edit Ground' : 'Add New Ground'}
              </h2>
              <GroundForm editingGroundId={editingGround} setEditingGroundId={setEditingGround} />
            </div>
          )}
          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🏟️</span>
              Grounds
            </h2>
            <GroundList setEditingGroundId={setEditingGround} />
            {/* Public view illustration and tagline */}
            {isPublicView && (
              <>
                <img
                  src="/public_grounds_illustration.svg"
                  alt="Grounds Illustration"
                  className={styles.publicImage}
                  style={{ maxWidth: 120, margin: '2rem auto 1rem', display: 'block' }}
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
                {/* <div className={styles.publicTagline}>
                  <em>“The field is where legends are made.”</em>
                  <br />
                  <span style={{ fontSize: '1rem', color: '#a0eec0' }}>— Anonymous</span>
                </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundsPage;