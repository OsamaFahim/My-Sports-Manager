import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function signup(req: Request, res: Response) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Missing credentials' });
  const result = await authService.signupService({ username, email, password });
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });
  const result = await authService.LoginService({ username, password });
  res.json(result);
}