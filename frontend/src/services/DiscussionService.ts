import api from './api';
import { Discussion, Comment } from '../contexts/DiscussionContext';

export const getDiscussions = async (): Promise<Discussion[]> => {
  const res = await api.get('/discussions');
  return res.data;
};

export const addDiscussion = async (data: { title: string; content: string }): Promise<Discussion> => {
  const res = await api.post('/discussions', data);
  return res.data;
};

export const updateDiscussion = async (id: string, data: { title: string; content: string }): Promise<Discussion> => {
  const res = await api.put(`/discussions/${id}`, data);
  return res.data;
};

export const deleteDiscussion = async (id: string): Promise<void> => {
  await api.delete(`/discussions/${id}`);
};

export const getComments = async (): Promise<Comment[]> => {
  const res = await api.get('/discussions/comments');
  return res.data;
};

export const addComment = async (data: { discussionId: string; parentId: string | null; content: string }): Promise<Comment> => {
  const token = sessionStorage.getItem('token');
  const res = await api.post('/discussions/comments', data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return res.data;
};

export const deleteComment = async (id: string): Promise<void> => {
  await api.delete(`/discussions/comments/${id}`);
};