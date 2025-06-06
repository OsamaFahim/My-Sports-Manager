import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Malformed token' });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'JWT secret not configured' });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { username: string };
    (req as any).user = { username: decoded.username };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}