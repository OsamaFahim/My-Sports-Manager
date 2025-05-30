import Notification, { INotification } from '../models/Notification';

export async function addNotification(message: string, recipients: string[]) {
  const notifications = recipients.map(username => ({
    recipient: username,
    message,
    createdAt: new Date(),
    seen: false,
  }));
  await Notification.insertMany(notifications);
}

export async function getUserNotifications(username: string) {
  return Notification.find({ recipient: username }).sort({ createdAt: -1 }).lean();
}

export async function getUserUnseenNotifications(username: string) {
  return Notification.find({ recipient: username, seen: false }).sort({ createdAt: -1 }).lean();
}

export async function markAllAsSeen(username: string) {
  await Notification.updateMany({ recipient: username, seen: false }, { $set: { seen: true } });
}