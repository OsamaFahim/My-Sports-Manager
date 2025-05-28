import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function signup(req: Request, res: Response) {
  const { username, email, password } = req.body;
  //Check for mssing fields is not required here, as the frontend will ensure these fields are present
  const result = await authService.signupService({ username, email, password });
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  //check for missing fields is not required here, as the frontend will ensure these fields are present
  const result = await authService.LoginService({ username, password });
  res.json(result);
}