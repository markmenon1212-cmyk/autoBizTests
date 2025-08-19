import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    console.log('Connecting to MongoDB...', uri);
    const client = await MongoClient.connect(uri);
    const db = client.db();
    
    // Test the connection
    await db.admin().ping();
    console.log('MongoDB connected successfully');
    
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
