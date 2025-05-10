import express, { Request, Response } from 'express';
import { signupService } from '../services/authService';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const result = await signupService(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;