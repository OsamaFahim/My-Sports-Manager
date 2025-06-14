import React, { useState, useRef } from 'react';
import { useDiscussions } from '../../contexts/DiscussionContext';
import DiscussionList from './DiscussionList';
import DiscussionForm from './DiscussionForm';
import styles from './discussions.module.css';

const DiscussionsPage: React.FC = () => {
  const { isAuthenticated } = useDiscussions();
  const [showForm, setShowForm] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Optionally, you can sync the scrollWidth for some other logic, but not needed for native scrollbars

  return (
    <div className={styles.discussionsPageRoot}>
      <div className={styles.horizontalScrollWrapper} ref={scrollRef}>
        <div className={styles.container} ref={contentRef}>
          <div className={styles.wrapper}>
            <div className={styles.pageHeader}>
              <h2 className={styles.title}>Discussions</h2>
              <p className={styles.subtitle}>Share your thoughts, ask questions, and discuss anything sports-related!</p>
            </div>
            {isAuthenticated && (
              <button className={styles.addButton} onClick={() => setShowForm(v => !v)}>
                {showForm ? 'Cancel' : 'Start New Discussion'}
              </button>
            )}
            {showForm && <DiscussionForm onDone={() => setShowForm(false)} />}
            <DiscussionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionsPage;