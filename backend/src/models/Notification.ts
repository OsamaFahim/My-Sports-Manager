import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: string;
  message: string;
  createdAt: Date;
  seen: boolean;
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: String, required: true, index: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);