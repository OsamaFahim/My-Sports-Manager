import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

import authRoutes from './routes/auth';   // 👈 import Auth Routes
import teamsRoutes from './routes/teams'; // 👈 import Teams Routes
import { connectToMongo } from './config/db';    // 👈 import MongoDB connection

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true,
}));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('My Sports Manager Backend is Running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectToMongo(); // 👈 ensure MongoDB is connected before starting the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
