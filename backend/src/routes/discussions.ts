import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import * as discussionController from '../controllers/discussionController';

const router = express.Router();

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
}

// Public routes
router.get('/', wrap(discussionController.getDiscussions));
router.get('/comments', wrap(discussionController.getComments));
router.post('/comments', wrap(discussionController.createComment));

// Protected routes (require authentication)
router.use(authenticateJWT);

router.post('/', wrap(discussionController.createDiscussion));
router.put('/:id', wrap(discussionController.updateDiscussion));
router.delete('/:id', wrap(discussionController.deleteDiscussion));
router.delete('/comments/:id', wrap(discussionController.deleteComment));

export default router;