import { Request, Response } from 'express';
import * as groundService from '../services/groundService';

//Functions for logged out users
export async function getAllGrounds(req: Request, res: Response) {
  const grounds = await groundService.getAllGrounds();
  res.json(grounds);
}

//Functions for Logged in users
export async function getGrounds(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });
  const grounds = await groundService.getGroundsByUsername(username);
  res.json(grounds);
}

export async function createGround(req: Request, res: Response) {
  const username = (req as any).user?.username;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });
  const ground = await groundService.createGround(username, req.body);
  res.json(ground);
}

export async function updateGround(req: Request, res: Response) {
  const { id } = req.params;
  const result = await groundService.updateGround(id, req.body);
  res.json(result);
}

export async function deleteGround(req: Request, res: Response) {
  const { id } = req.params;
  const result = await groundService.deleteGround(id);
  res.json(result);
}