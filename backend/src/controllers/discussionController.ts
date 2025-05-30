import { Request, Response } from 'express';
import * as discussionService from '../services/discussionService';
import jwt from 'jsonwebtoken';

// GET /api/discussions
export async function getDiscussions(req: Request, res: Response): Promise<void> {
  const discussions = await discussionService.getAllDiscussions();
  res.json(discussions);
}

// POST /api/discussions (protected)
export async function createDiscussion(req: Request, res: Response): Promise<void> {
  const username = (req as any).user?.username;
  const { title, content } = req.body;
  if (!username || !title || !content) {
    res.status(400).json({ message: 'Missing data' });
    return;
  }
  const discussion = await discussionService.createDiscussion(username, { title, content });
  res.json(discussion);
}

// PUT /api/discussions/:id (protected)
export async function updateDiscussion(req: Request, res: Response): Promise<void> {
  const username = (req as any).user?.username;
  const { id } = req.params;
  const { title, content } = req.body;
  if (!username || !title || !content) {
    res.status(400).json({ message: 'Missing data' });
    return;
  }
  const updated = await discussionService.updateDiscussion(id, username, { title, content });
  if (!updated) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.json(updated);
}

// DELETE /api/discussions/:id (protected)
export async function deleteDiscussion(req: Request, res: Response): Promise<void> {
  const username = (req as any).user?.username;
  const { id } = req.params;
  if (!username) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const result = await discussionService.deleteDiscussion(id, username);
  if (!result.success) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.json(result);
}

// GET /api/discussions/comments
export async function getComments(req: Request, res: Response): Promise<void> {
  const comments = await discussionService.getAllComments();
  res.json(comments);
}

// POST /api/discussions/comments (anyone)
export async function createComment(req: Request, res: Response): Promise<void> {
  let username = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yoursecret') as { username?: string };
      if (decoded && decoded.username) {
        username = decoded.username;
      }
    } catch (err) {
      // Invalid token, ignore and treat as anonymous
    }
  }

  if (!username) {
    username = "Anonymous";
  }
  
  const { discussionId, parentId, content } = req.body;
  if (!discussionId || !content) {
    res.status(400).json({ message: 'Missing data' });
    return;
  }
  const comment = await discussionService.createComment({ username, discussionId, parentId, content });
  res.status(201).json(comment);
}

// DELETE /api/discussions/comments/:id (protected for owner)
export async function deleteComment(req: Request, res: Response): Promise<void> {
  const username = (req as any).user?.username || null;
  const { id } = req.params;
  const result = await discussionService.deleteComment(id, username);
  if (!result.success) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.json(result);
}