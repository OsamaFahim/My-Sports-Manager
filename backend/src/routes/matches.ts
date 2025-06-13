import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import * as matchController from '../controllers/matchController';

const router = express.Router();

// Public route to get all matches
router.get('/all', wrap(matchController.getAllMatches));

router.use(authenticateJWT);

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => fn(req, res).catch(next);
}

router.get('/', wrap(matchController.getMatches));
router.post('/', wrap(matchController.createMatch));
router.put('/:id', wrap(matchController.updateMatch));
router.delete('/:id', wrap(matchController.deleteMatch))

export default router;