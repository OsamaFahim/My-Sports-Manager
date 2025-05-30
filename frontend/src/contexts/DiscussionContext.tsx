import React, { createContext, useContext, useState, useEffect } from 'react';
import * as discussionService from '../services/DiscussionService';
import { useAuth } from './AuthContext';

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  username?: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  discussionId: string;
  parentId: string | null;
  content: string;
  username?: string;
  createdAt: string;
}

interface DiscussionContextType {
  discussions: Discussion[];
  comments: Comment[];
  loading: boolean;
  addDiscussion: (data: { title: string; content: string }) => Promise<void>;
  updateDiscussion: (id: string, data: { title: string; content: string }) => Promise<void>;
  deleteDiscussion: (id: string) => Promise<void>;
  addComment: (data: { discussionId: string; parentId: string | null; content: string }) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  getCommentsByDiscussion: (discussionId: string) => Comment[];
  isAuthenticated: boolean;
  username: string | null;
}

const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined);

export const DiscussionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, username } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [discs, comms] = await Promise.all([
          discussionService.getDiscussions(),
          discussionService.getComments(),
        ]);
        if (mounted) {
          setDiscussions(discs);
          setComments(comms);
        }
      } catch (error) {
        console.error('Failed to fetch discussions or comments:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const addDiscussion = async (data: { title: string; content: string }) => {
    setLoading(true);
    try {
      const newDiscussion = await discussionService.addDiscussion(data);
      setDiscussions(prev => [newDiscussion, ...prev]);
    } catch (error) {
      console.error('Failed to add discussion:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDiscussion = async (id: string, data: { title: string; content: string }) => {
    setLoading(true);
    try {
      const updated = await discussionService.updateDiscussion(id, data);
      setDiscussions(prev => prev.map(d => (d._id === id ? updated : d)));
    } catch (error) {
      console.error('Failed to update discussion:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscussion = async (id: string) => {
    setLoading(true);
    try {
      await discussionService.deleteDiscussion(id);
      setDiscussions(prev => prev.filter(d => d._id !== id));
      setComments(prev => prev.filter(c => c.discussionId !== id));
    } catch (error) {
      console.error('Failed to delete discussion:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (data: { discussionId: string; parentId: string | null; content: string }) => {
    setLoading(true);
    try {
      const newComment = await discussionService.addComment(data);
      setComments(prev => [...prev, newComment]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id: string) => {
    setLoading(true);
    try {
      await discussionService.deleteComment(id);
      setComments(prev => prev.filter(c => c._id !== id && c.parentId !== id));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCommentsByDiscussion = (discussionId: string) =>
    comments.filter(c => c.discussionId === discussionId);

  return (
    <DiscussionContext.Provider value={{
      discussions, addDiscussion, updateDiscussion, deleteDiscussion,
      comments, addComment, deleteComment, getCommentsByDiscussion,
      isAuthenticated, username, loading
    }}>
      {children}
    </DiscussionContext.Provider>
  );
};

export function useDiscussions() {
  const context = useContext(DiscussionContext);
  if (!context) throw new Error('useDiscussions must be used within a DiscussionProvider');
  return context;
}