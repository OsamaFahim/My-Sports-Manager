import express from 'express';
import * as authController from '../controllers/authController';
import { errorHandler } from '../middlewares/ErrorHandlerMiddleware';

const router = express.Router();

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => fn(req, res).catch(next);
}

router.post('/signup', wrap(authController.signup));
router.post('/login', wrap(authController.login));

// Centralized error handler (for async errors)
router.use(errorHandler);

export default router;