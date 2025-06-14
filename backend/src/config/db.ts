// Import Mongoose, which is an ODM (Object Data Modeling) library for MongoDB
import mongoose from 'mongoose';

// Load environment variables from .env file (e.g., MONGO_URI, DB_NAME)
import dotenv from 'dotenv';
dotenv.config();

// Define the MongoDB connection URI and database name
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'Sportify';

// Validate that MONGO_URI is defined
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  console.error('Make sure you have a .env file with MONGO_URI set');
  process.exit(1);
}

/**
 * Connects to MongoDB using Mongoose.
 * This function ensures that only one connection is created (singleton behavior is built-in).
 * 
 * Mongoose automatically handles connection pooling, reconnection, and model reuse.
 */
export async function connectToMongo(): Promise<void> {
  // Mongoose has a built-in connection state:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  //Gives Singlelton Pattern effect, ensuring only one connection is created
  if (mongoose.connection.readyState >= 1) {
    // If already connected or connecting, do nothing
    return;
  }
  try {
    // Connect to MongoDB with the provided URI and database name
    await mongoose.connect(MONGO_URI as string, {
      dbName: DB_NAME, 
    });

    // Log only once, since connection is only created once
    console.log('✅ Connected to MongoDB via Mongoose');
  } catch (err) {
    // Log the error and exit the process if connection fails
    console.error('❌ Mongoose connection failed:', err);
    process.exit(1);
  }
}
