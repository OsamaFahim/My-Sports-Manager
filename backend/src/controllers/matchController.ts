import { Request, Response } from 'express';
import { isGroundAvailable } from '../utils/matchValidation';
import * as matchService from '../services/matchService';

// Get all matches (public)
export async function getAllMatches(req: Request, res: Response) {
  const matches = await matchService.getAllMatches();
  res.json(matches);
}

// Get matches for a user (authenticated)
export async function getMatches(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });
  const matches = await matchService.getMatchesByUsername(username);
  res.json(matches);
}

// Create a match (authenticated)
export async function createMatch(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });

  const { ground, teamA, teamB, datetime } = req.body;
  const availability = await isGroundAvailable(ground, datetime, username);
  if (!availability.available) {
    return res.status(400).json({
      errors: { [availability.reason]: availability.message }
    });
  }

  const match = await matchService.createMatch(username, { teamA, teamB, ground, datetime });
  res.json(match);
}

// Update a match (authenticated)
export async function updateMatch(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.params;
  const { ground, teamA, teamB, datetime } = req.body;

  const availability = await isGroundAvailable(ground, datetime, username, id);
  if (!availability.available) {
    return res.status(400).json({
      errors: { [availability.reason]: availability.message }
    });
  }

  const result = await matchService.updateMatch(id, { teamA, teamB, ground, datetime });
  res.json(result);
}

// Delete a match (authenticated)
export async function deleteMatch(req: Request, res: Response) {
  const { id } = req.params;
  const result = await matchService.deleteMatch(id);
  res.json(result);
}

// Check ticket availability for a match (public)
export async function checkTicketAvailability(req: Request, res: Response) {
  const { matchId } = req.params;
  try {
    const result = await matchService.checkTicketAvailability(matchId);
    if (!result.available) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ available: false, message: 'Server error' });
  }
}