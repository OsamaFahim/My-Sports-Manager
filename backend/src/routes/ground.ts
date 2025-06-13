import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import * as groundController from '../controllers/groundController';

const router = express.Router();

//Public routes for logged-out users
router.get('/all', groundController.getAllGrounds);

router.use(authenticateJWT);

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => fn(req, res).catch(next);
}

//Protected routes for logged-in users
router.get('/', wrap(groundController.getGrounds));
router.post('/', wrap(groundController.createGround));
router.put('/:id', wrap(groundController.updateGround));
router.delete('/:id', wrap(groundController.deleteGround));

export default router;