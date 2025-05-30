import React, { useState } from 'react';
import { useDiscussions } from '../../contexts/DiscussionContext';
import styles from './discussions.module.css';

interface CommentFormProps {
  discussionId: string;
  parentId: string | null;
  buttonLabel: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ discussionId, parentId, buttonLabel }) => {
  const [content, setContent] = useState('');
  const { addComment } = useDiscussions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addComment({ discussionId, parentId, content });
    setContent('');
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a comment..."
        value={content}
        onChange={e => setContent(e.target.value)}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.submitBtn}>
        {buttonLabel}
      </button>
    </form>
  );
};

export default CommentForm;