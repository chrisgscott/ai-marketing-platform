import { MongoClient, Db, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

const client = new MongoClient(uri);
let db: Db;

export async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('ai_marketing_platform');
    console.log('Connected to MongoDB');
  }
  return db;
}

export async function saveClientAvatar(userId: string, avatarData: any): Promise<string> {
  const database = await connectToDatabase();
  const collection = database.collection('clientAvatars');
  const result = await collection.insertOne({ userId, ...avatarData, createdAt: new Date() });
  return result.insertedId.toString();
}

export async function getClientAvatar(avatarId: string) {
  const database = await connectToDatabase();
  const collection = database.collection('clientAvatars');
  return collection.findOne({ _id: new ObjectId(avatarId) });
}

export async function getUserAvatars(userId: string) {
  const database = await connectToDatabase();
  const collection = database.collection('clientAvatars');
  return collection.find({ userId }).toArray();
}

export async function saveUSP(userId: string, uspData: any): Promise<string> {
    const database = await connectToDatabase();
    const collection = database.collection('usps');
    const result = await collection.insertOne({ userId, ...uspData, createdAt: new Date() });
    return result.insertedId.toString();
  }
  
  export async function getUSP(uspId: string) {
    const database = await connectToDatabase();
    const collection = database.collection('usps');
    return collection.findOne({ _id: new ObjectId(uspId) });
  }
  
  export async function getUserUSPs(userId: string) {
    const database = await connectToDatabase();
    const collection = database.collection('usps');
    return collection.find({ userId }).toArray();
  }