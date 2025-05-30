import React, { useState } from 'react';
import { useDiscussions } from '../../contexts/DiscussionContext';
import DiscussionList from './DiscussionList';
import DiscussionForm from './DiscussionForm';
import styles from './discussions.module.css';

const DiscussionsPage: React.FC = () => {
  const { isAuthenticated } = useDiscussions();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Discussions</h2>
      <p className={styles.subtitle}>Share your thoughts, ask questions, and discuss anything sports-related!</p>
      {isAuthenticated && (
        <button className={styles.addButton} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : 'Add Discussion'}
        </button>
      )}
      {showForm && <DiscussionForm onDone={() => setShowForm(false)} />}
      <DiscussionList />
    </div>
  );
};

export default DiscussionsPage;