// File: backend/src/services/authService.ts
import bcrypt from 'bcryptjs';
import { connectToMongo } from '../config/db';
import jwt from 'jsonwebtoken';

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export async function signupService({ username, email, password }: SignupInput): Promise<{ message: string; token: string }> {
  const db = await connectToMongo();
  const users = db.collection('users');

  // Check if user already exists
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  await users.insertOne({ username, email, password: hashedPassword });

  // Create JWT token (optional, but recommended for auth)
  const token = jwt.sign({ email, username }, process.env.JWT_SECRET || 'yoursecret', { expiresIn: '1h' });

  return { message: 'User created successfully', token };
}
