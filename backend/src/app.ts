import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Use type-only import for types
import type { Request, Response } from 'express';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('My Sports Manager Backend is Running!');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI as string) // Type assertion for the MONGO_URI
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
