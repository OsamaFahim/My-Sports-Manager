import api from './api';

export interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  seen: boolean;
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await api.get('/notifications');
  return res.data;
}

export async function getUnseenNotifications(): Promise<Notification[]> {
  const res = await api.get('/notifications/unseen');
  return res.data;
}

export async function markAllAsSeen(): Promise<void> {
  await api.post('/notifications/mark-all-seen');
}