import { MongoClient, Db } from "mongodb"; //a type that represents a mongodb type instance
import dotenv from "dotenv";

dotenv.config();

//Reading from enviroment variables
const uri = process.env.MONGO_URI!;
const dbName = process.env.DB_NAME || "Sportify";

const client = new MongoClient(uri);

//db can ether be a Db object (from MongoDB) or it can be null (in the beginning) when
//no connection is made initially.
let db: Db | null = null;
export async function connectToMongo(): Promise<Db> {
  //Singelton pattern is being followd if db has been connected then return the same instance
  //and do not create it again
  if (db) {
    return db;
  }

  try {
    await client.connect();
    db = client.db(dbName)
    //console.log("✅ Connected to MongoDB");
    return db;
  } catch (err) {
    //console.error("❌ MongoDB connection failed:", err);
    process.exit(1);  
  }
}
