import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  discussionId: Types.ObjectId;
  parentId: Types.ObjectId | null;
  content: string;
  username?: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  discussionId: { type: Schema.Types.ObjectId, ref: 'Discussion', required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  content: { type: String, required: true },
  username: { type: String }, // null/undefined for anonymous
  createdAt: { type: Date, default: Date.now }
});

export default model<IComment>('Comment', commentSchema);