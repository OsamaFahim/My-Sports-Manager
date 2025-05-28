import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => fn(req, res).catch(next);
}

router.post('/signup', wrap(authController.signup));
router.post('/login', wrap(authController.login));

export default router;