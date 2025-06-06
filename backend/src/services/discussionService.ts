import Discussion, { IDiscussion } from '../models/Discussion';
import Comment, { IComment } from '../models/Comment';

export async function getAllDiscussions(): Promise<IDiscussion[]> {
  return Discussion.find().sort({ createdAt: -1 }).lean();
}

export async function createDiscussion(
  username: string,
  data: { title: string; content: string }
): Promise<IDiscussion> {
  const discussion = new Discussion({ ...data, username });
  await discussion.save();
  return discussion.toObject();
}

export async function updateDiscussion(
  id: string,
  username: string,
  data: { title: string; content: string }
): Promise<IDiscussion | null> {
  const discussion = await Discussion.findById(id);
  if (!discussion || discussion.username !== username) return null;
  discussion.title = data.title;
  discussion.content = data.content;
  await discussion.save();
  return discussion.toObject();
}

export async function deleteDiscussion(
  id: string,
  username: string
): Promise<{ success: boolean }> {
  const discussion = await Discussion.findById(id);
  if (!discussion || discussion.username !== username) return { success: false };
  await Discussion.findByIdAndDelete(id);
  await Comment.deleteMany({ discussionId: id });
  return { success: true };
}

// Comments
export async function getAllComments(): Promise<IComment[]> {
  return Comment.find().sort({ createdAt: 1 }).lean();
}

export async function createComment({ discussionId, parentId, content, username }: {
  discussionId: string;
  parentId: string | null;
  content: string;
  username: string | null;
}) {
  const comment = new Comment({
    discussionId,
    parentId,
    content,
    username: username || undefined, // undefined will be stored as null in Mongo
    createdAt: new Date(),
  });
  await comment.save();
  return comment;
}

export async function deleteComment(
  id: string,
  username: string | null
): Promise<{ success: boolean }> {
  const comment = await Comment.findById(id);
  if (!comment) return { success: false };

  // Find the discussion for this comment
  const discussion = await Discussion.findById(comment.discussionId);

  // Allow if user is comment author or discussion owner
  if (
    (comment.username && comment.username === username) ||
    (discussion && discussion.username === username)
  ) {
    await Comment.deleteOne({ _id: id });
    await Comment.deleteMany({ parentId: id }); // delete replies
    return { success: true };
  }

  return { success: false };
}