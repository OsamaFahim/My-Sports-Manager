import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import * as teamController from '../controllers/teamController';

const router = express.Router();

//Public routes can be accessed without authentication (get all teams)
router.get('/all', teamController.getAllTeams);

//These are protected routes, so we need to authenticate the user first
//and protected routes are only accessible to authenticated users,
//protected routes use authenticateJWT middleware
router.use(authenticateJWT);

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => fn(req, res).catch(next);
}

router.get('/', wrap(teamController.getTeams));
router.post('/', wrap(teamController.createTeam));
router.put('/:id', wrap(teamController.updateTeam));
router.delete('/:id', wrap(teamController.deleteTeam));
router.post('/:id/players', wrap(teamController.addPlayer));
router.put('/:teamId/players/:playerId', wrap(teamController.updatePlayer));
router.delete('/:teamId/players/:playerId', wrap(teamController.deletePlayer));

export default router;