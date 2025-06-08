// File: backend/src/services/authService.ts
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Importing the utility function to create HTTP errors
import { createHttpError } from '../utils/createHttpError';

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
  // Check if user's username already exists
  const exsistingUserUsername = await User.findOne({ username });
  if (exsistingUserUsername) {
    throw createHttpError('Username already in use', 409);
  }

  // Check if user's email already exists
  const existingUserEmail = await User.findOne({ email });
  if (existingUserEmail) {
    throw createHttpError('Email already in use', 409); // Fixed the incorrect message
  }
  // Hash password before storing in DB
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into the database
  const newUser = await User.create({ username, email, password: hashedPassword });

  // ✅ Create JWT token (recommended for authentication)
  // Reason: After signing up, the user is usually logged in automatically.
  // By issuing a token here, the user does not need to login again right after signup.
  // The token can be stored on the client side (usually in localStorage or cookies)
  // and will be used in Authorization headers to access protected routes.
  //
  // Example: Creating, editing, or deleting a team should only be allowed for logged-in users.
  // The frontend sends this token on every request to those routes.
  // The backend checks the token and allows access only if it's valid.
  const token = jwt.sign({ 
    userId: newUser._id, 
    username: newUser.username 
  }, process.env.JWT_SECRET || 'yoursecret', { expiresIn: '1h' });

  return { message: 'User created successfully', token };
}

export async function LoginService({ username, password }: LoginInput): Promise<{ message: string; token: string }> {
  // Check if username exists
  const validUsername = await User.findOne({ username });
  if (!validUsername) {
    throw createHttpError('Username is not valid', 401);
  }

  // Compare provided password with stored hashed password
  const validUser = await bcrypt.compare(password, validUsername.password);
  if (!validUser) {
    throw createHttpError('Password is not valid', 401);
  }
  // ✅ Create JWT token after successful login
  // Reason: This token is crucial for maintaining authenticated sessions in a stateless manner.
  // Once logged in, the frontend stores this token and includes it in the Authorization header
  // for all requests to protected backend routes.
  //
  // Example: In our app, only authenticated users can create, update, or delete their teams.
  // Without a valid JWT token, the user will only be allowed to see public teams or none at all.
  // The backend middleware (like authenticateJWT) uses this token to verify the user's identity.
  const token = jwt.sign({ 
    userId: validUsername._id, 
    username: validUsername.username 
  }, process.env.JWT_SECRET || 'yoursecret', { expiresIn: '1h' });

  return { message: 'User logged in successfully', token };
}
