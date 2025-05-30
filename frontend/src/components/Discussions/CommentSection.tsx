import React from 'react';
import { useDiscussions } from '../../contexts/DiscussionContext';
import CommentForm from './CommentForm';
import styles from './discussions.module.css';

interface CommentSectionProps {
  discussionId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ discussionId }) => {
  const { getCommentsByDiscussion, isAuthenticated, username, deleteComment, discussions } = useDiscussions();
  const comments = getCommentsByDiscussion(discussionId);
  const discussion = discussions.find(d => d._id === discussionId);

  // Recursive rendering for replies
  const renderComments = (parentId: string | null = null, level = 0) =>
    comments
      .filter(c => c.parentId === parentId)
      .map(comment => {
        // Allow delete if user is comment author or discussion owner
        const canDelete =
          isAuthenticated &&
          (username === comment.username || username === discussion?.username);

        return (
          <div key={comment._id} className={styles.comment} style={{ marginLeft: level * 24 }}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor}>{comment.username || 'Anonymous'}</span>
              <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</span>
              {canDelete && (
                <button className={styles.deleteBtn} onClick={() => deleteComment(comment._id)}>
                  Delete
                </button>
              )}
            </div>
            <div className={styles.commentContent}>{comment.content}</div>
            <CommentForm discussionId={discussionId} parentId={comment._id} buttonLabel="Reply" />
            {renderComments(comment._id, level + 1)}
          </div>
        );
      });

  return (
    <div className={styles.commentSection}>
      <h4>Comments</h4>
      <CommentForm discussionId={discussionId} parentId={null} buttonLabel="Comment" />
      {renderComments()}
    </div>
  );
};

export default CommentSection;