import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import * as matchController from '../controllers/matchController';

const router = express.Router();

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => fn(req, res).catch(next);
}

// Public route to get all matches
router.get('/all', wrap(matchController.getAllMatches));

// Public route to check ticket availability for a match
router.get('/:matchId/tickets/availability', wrap(matchController.checkTicketAvailability));

// Authenticated routes
router.use(authenticateJWT);

router.get('/', wrap(matchController.getMatches));
router.post('/', wrap(matchController.createMatch));
router.put('/:id', wrap(matchController.updateMatch));
router.delete('/:id', wrap(matchController.deleteMatch));

export default router;