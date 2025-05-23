import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI!;
const dbName = process.env.DB_NAME || "Sportify";

async function initMongo() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();

    const exists = dbs.databases.some((db) => db.name === dbName);

    if (!exists) {
      console.log(`Creating database: ${dbName}`);
      const db = client.db(dbName);
      await db.collection("initCollection").insertOne({ createdAt: new Date() });
      //console.log(`✅ Database "${dbName}" created.`);
    } else {
      //console.log(`✅ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    //console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

initMongo();
