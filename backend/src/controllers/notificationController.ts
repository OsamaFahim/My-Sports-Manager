import { Request, Response } from 'express';
import * as notificationService from '../services/notificationService';

export async function getNotifications(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });
  const notifications = await notificationService.getUserNotifications(username);
  res.json(notifications);
}

export async function getUnseenNotifications(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });
  const notifications = await notificationService.getUserUnseenNotifications(username);
  res.json(notifications);
}

export async function markAllAsSeen(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });
  await notificationService.markAllAsSeen(username);
  res.json({ success: true });
}