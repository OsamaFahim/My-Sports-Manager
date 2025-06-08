import React, { useState } from 'react';
import styles from '../Management/ManagementPages.module.css';
import { useGrounds } from '../../contexts/GroundContext';
import GroundForm from './GroundForm';
import GroundList from './GroundList';

const GroundsPage: React.FC = () => {
  const { loading } = useGrounds();
  const [editingGroundId, setEditingGroundId] = useState<string | null>(null);

  return (
    <div className={styles.managementContainer}>
      <div className={styles.managementWrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Ground Management</h1>
          <p className={styles.pageSubtitle}>
            Create, edit, and manage your grounds. Configure venues, track facilities, and organize your sporting infrastructure with comprehensive ground management tools.
          </p>
        </div>
        
        <div className={styles.contentGrid}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🏟️</span>
              {editingGroundId ? 'Edit Ground' : 'Add New Ground'}
            </h2>
            <GroundForm editingGroundId={editingGroundId} setEditingGroundId={setEditingGroundId} />
          </div>
          
          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🗺️</span>
              Registered Grounds
            </h2>
            {loading ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                Loading grounds...
              </div>
            ) : (
              <GroundList setEditingGroundId={setEditingGroundId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundsPage;