import axios from 'axios';

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export async function signup(data: SignupData) {
  //console.log('Sending signup request with data:', data);
  const response = await axios.post('http://localhost:5000/api/auth/signup', data);
  return response.data;
}

export async function checkEmailExists(email: string) {
  const response = await axios.post('http://localhost:5000/api/auth/check-email', email);
  return response.data;
}