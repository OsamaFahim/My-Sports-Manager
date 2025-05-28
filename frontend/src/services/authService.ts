import axios from 'axios';

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export async function signup(data: SignupData) {
  const response = await axios.post('http://localhost:5000/api/auth/signup', data);
  return response.data;
}

export async function login(data: LoginData) {
  const response = await axios.post('http://localhost:5000/api/auth/login', data);
  return response.data;
}