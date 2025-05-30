import { Schema, model, Document } from 'mongoose';

export interface IDiscussion extends Document {
  title: string;
  content: string;
  username?: string;
  createdAt: Date;
}

const discussionSchema = new Schema<IDiscussion>({
  title: { type: String, required: true, maxlength: 120 },
  content: { type: String, required: true },
  username: { type: String }, // null/undefined for anonymous
  createdAt: { type: Date, default: Date.now }
});

export default model<IDiscussion>('Discussion', discussionSchema);