import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { connectToDatabase } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function registerUser(email: string, password: string): Promise<User> {
  const db = await connectToDatabase();
  const usersCollection = db.collection<User>('users');

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    email,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date()
  };

  const result = await usersCollection.insertOne(newUser);
  newUser._id = result.insertedId;

  return newUser;
}

export async function loginUser(email: string, password: string): Promise<string> {
  const db = await connectToDatabase();
  const usersCollection = db.collection<User>('users');

  const user = await usersCollection.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
}