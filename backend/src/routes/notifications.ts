import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import * as notificationController from '../controllers/notificationController';

const router = express.Router();

router.use(authenticateJWT);

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => fn(req, res).catch(next);
}

router.get('/', wrap(notificationController.getNotifications));
router.get('/unseen', wrap(notificationController.getUnseenNotifications));
router.post('/mark-all-seen', wrap(notificationController.markAllAsSeen));

export default router;