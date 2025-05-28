import { Request, Response } from 'express';
import * as teamService from '../services/teamService';

export async function getTeams(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });
  const teams = await teamService.getTeamsByUsername(username);
  res.json(teams);
}

export async function createTeam(req: Request, res: Response) {
  const username = (req as any).user?.username;
  const { name } = req.body;
  if (!username || !name) return res.status(400).json({ message: 'Missing data' });
  const team = await teamService.createTeam(username, name);
  res.json(team);
}

export async function updateTeam(req: Request, res: Response) {
  const { name } = req.body;
  const { id } = req.params;
  if (!name) return res.status(400).json({ message: 'Missing team name' });
  const result = await teamService.updateTeam(id, name);
  res.json(result);
}

export async function deleteTeam(req: Request, res: Response) {
  const { id } = req.params;
  const result = await teamService.deleteTeam(id);
  res.json(result);
}

export async function addPlayer(req: Request, res: Response) {
  const { id } = req.params;
  const player = { ...req.body };
  const result = await teamService.addPlayer(id, player);
  res.json(result);
}

export async function updatePlayer(req: Request, res: Response) {
  const { teamId, playerId } = req.params;
  const player = { ...req.body, _id: playerId };
  const result = await teamService.updatePlayer(teamId, playerId, player);
  res.json(result);
}

export async function deletePlayer(req: Request, res: Response) {
  const { teamId, playerId } = req.params;
  const result = await teamService.deletePlayer(teamId, playerId);
  res.json(result);
}