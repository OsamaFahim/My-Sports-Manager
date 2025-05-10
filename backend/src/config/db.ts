import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI!;
const dbName = process.env.DB_NAME || "Sportify";

const client = new MongoClient(uri);

export async function connectToMongo() {
  try {
    await client.connect();
    //console.log("✅ Connected to MongoDB");
    return client.db(dbName);
  } catch (err) {
    //console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}
