import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { errorHandler } from '../middlewares/ErrorHandlerMiddleware';
import * as groundController from '../controllers/groundController';

const router = express.Router();

router.use(authenticateJWT);

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => fn(req, res).catch(next);
}

const asyncHandler = (fn: express.RequestHandler) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', wrap(groundController.getGrounds));
router.post('/', wrap(groundController.createGround));
router.put('/:id', wrap(groundController.updateGround));
router.delete('/:id', wrap(groundController.deleteGround));

router.use(errorHandler);

export default router;