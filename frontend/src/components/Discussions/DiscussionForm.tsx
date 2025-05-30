import React, { useState } from 'react';
import { useDiscussions, Discussion } from '../../contexts/DiscussionContext';
import styles from './discussions.module.css';

interface Props {
  onDone: () => void;
  initial?: Discussion;
  editingId?: string | null;
}

const DiscussionForm: React.FC<Props> = ({ onDone, initial, editingId }) => {
  const { addDiscussion, updateDiscussion } = useDiscussions();
  const [form, setForm] = useState({
    title: initial?.title || '',
    content: initial?.content || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    if (editingId) {
      await updateDiscussion(editingId, form);
    } else {
      await addDiscussion(form);
    }
    setForm({ title: '', content: '' });
    onDone();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className={styles.input}
      />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="What's on your mind?"
        required
        className={styles.textarea}
      />
      <button className={styles.submitBtn} type="submit">{editingId ? 'Update' : 'Post'}</button>
      <button type="button" className={styles.cancelBtn} onClick={onDone}>Cancel</button>
    </form>
  );
};

export default DiscussionForm;