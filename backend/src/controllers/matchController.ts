import { Request, Response } from 'express';
import { isGroundAvailable } from '../utils/matchValidation';
import * as matchService from '../services/matchService';

export async function getAllMatches(req: Request, res: Response) {
  const matches = await matchService.getAllMatches();
  res.json(matches);
}

export async function getMatches(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });
  const matches = await matchService.getMatchesByUsername(username);
  res.json(matches);
}

export async function createMatch(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });

  const { ground, teamA, teamB, datetime } = req.body;
  //No validation needs to be done here, as the frontend will ensure these fields are present

  const availability = await isGroundAvailable(ground, datetime, username);
  if (!availability.available) {
    //console.log('400 error: Ground not available');
    return res.status(400).json({
      errors: { [availability.reason]: availability.message }
    });
  }

  const match = await matchService.createMatch(username, { teamA, teamB, ground, datetime });
  res.json(match);
}

export async function updateMatch(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.params;
  // No validation needs to be done here, as the frontend will ensure these fields are present
  const { ground, teamA, teamB, datetime } = req.body;

  //check if the ground is available, as the ground cannot be booked if a match is already
  //scheduled within 1 hour of the selected time

  const availability = await isGroundAvailable(ground, datetime, username, id);
  if (!availability.available) {
    //console.log('400 error: Ground not available');
    return res.status(400).json({
      errors: { [availability.reason]: availability.message }
    });
  }

  const result = await matchService.updateMatch(id, { teamA, teamB, ground, datetime });
  res.json(result);
}

export async function deleteMatch(req: Request, res: Response) {
  const { id } = req.params;
  const result = await matchService.deleteMatch(id);
  res.json(result);
}