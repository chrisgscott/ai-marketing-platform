import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}