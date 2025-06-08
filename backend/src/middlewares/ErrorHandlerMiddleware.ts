import { Request, Response, NextFunction } from 'express';

//Centralized error handler for the application
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Server error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
}