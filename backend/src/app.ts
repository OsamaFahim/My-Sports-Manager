import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import { errorHandler } from './middlewares/ErrorHandlerMiddleware';

// Importing routes
import authRoutes from './routes/auth';   // 👈 import Auth Routes
import teamsRoutes from './routes/teams'; // 👈 import Teams Routes
import groundsRoutes from './routes/ground'; // 👈 import Grounds Routes
import matchesRoutes from './routes/matches'; // 👈 import Matches Routes
import discussionsRoutes from './routes/discussions'; // import Discussion Routes
import notificationsRoutes from './routes/notifications'; //import notifications Routes



// Importing MongoDB connection
import { connectToMongo } from './config/db';    // 👈 import MongoDB connection

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  // Allow requests from the frontend running on localhost:5173
  origin: 'http://localhost:5173', 
  // Allow credentials to be sent with requests
  credentials: true,
}));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('My Sports Manager Backend is Running!');
});

// Registering routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/grounds', groundsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/discussions', discussionsRoutes); 
app.use('/api/notifications', notificationsRoutes);


//Regustering the global error handler after all the routes
app.use(errorHandler);

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
