import React, { useState } from 'react';
import { useDiscussions} from '../../contexts/DiscussionContext';
import CommentSection from './CommentSection';
import DiscussionForm from './DiscussionForm';
import styles from './discussions.module.css';

const DiscussionList: React.FC = () => {
  const { discussions, isAuthenticated, username, deleteDiscussion} = useDiscussions();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!discussions.length) return <p>No discussions yet. Be the first to post!</p>;

  return (
    <ul className={styles.discussionList}>
      {discussions.map(discussion => (
        <li key={discussion._id} className={styles.discussionItem}>
          <div className={styles.discussionHeader}>
            <h3>{discussion.title}</h3>
            <span className={styles.author}>
              {discussion.username || 'Anonymous'}
            </span>
            {isAuthenticated && username === discussion.username && (
              <span>
                <button className={styles.editBtn} onClick={() => setEditingId(discussion._id)}>
                  Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => deleteDiscussion(discussion._id)}>
                  Delete
                </button>
              </span>
            )}
          </div>
          {editingId === discussion._id ? (
            <DiscussionForm
              onDone={() => setEditingId(null)}
              initial={discussion}
              editingId={editingId}
            />
          ) : (
            <p>{discussion.content}</p>
          )}
          <CommentSection discussionId={discussion._id} />
        </li>
      ))}
    </ul>
  );
};

export default DiscussionList;