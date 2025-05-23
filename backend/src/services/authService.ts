// File: backend/src/services/authService.ts
import bcrypt from 'bcryptjs';
import { connectToMongo } from '../config/db';
import jwt from 'jsonwebtoken';

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export async function signupService({ username, email, password }: SignupInput): Promise<{ message: string; token: string }> {
  const db = await connectToMongo();
  const users = db.collection('users');

  //Check if user's username already exists
  const exsistingUserUsername = await checkUsernameExsistsService(username);
  if (exsistingUserUsername) {
    throw new Error('Username already is use');
  }

  // Check if user's email already exists
  const existingUserEmail = await checkEmailExistsService(email);
  if (existingUserEmail) {
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

export async function LoginService({ username, password }: LoginInput): Promise<{ message: string; token: string }> {

  const validUsername = await checkUsernameExsistsService(username);
  if (!validUsername) {
    throw new Error('Username is not valid');
  }

  const validUser = await checkValidPasswordExsistsService(username, password);
  if (!validUser) {
    throw new Error('Password is not valid')
  }

   // Create JWT token (optional, but recommended for auth)
  const token = jwt.sign({username, password}, process.env.JWT_SECRET || 'yoursecret', { expiresIn: '1h' });

  return {message: 'User created successfully', token};
}

//Service to check whether any user has same email
export async function checkEmailExistsService(email: string): Promise<boolean> {
  const db = await connectToMongo();
  const users = db.collection('users');

  // Check if email already exists
  const existingEmail = await users.findOne({ email });
  return !!existingEmail;  //does the same thing as return existingUser ? true : false;
}

////Service to check whether any user has same username
export async function checkUsernameExsistsService(username: string): Promise<boolean> {
  const db = await connectToMongo();
  const users = db.collection('users');

  //check if username already exsists
  const existingUsername = await users.findOne({ username });
  return !!existingUsername;
}

export async function checkValidPasswordExsistsService(username: string, password: string): Promise<boolean> {
  //Fetch the user by username 
  const db = await connectToMongo();
  const users = db.collection('users');
  const user = await users.findOne({ username });
  if (!user || !user.password) {
    return false;
  }

  //Compare the provided password with the hashed password in the db
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
}
