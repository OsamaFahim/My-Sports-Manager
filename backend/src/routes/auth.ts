import express, { Request, Response } from 'express';
import { LoginService, signupService } from '../services/authService';

const router = express.Router();

//Signup request sent by axios to here
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const result = await signupService(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

//Login request sent by axios to here
router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const result = await LoginService(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;