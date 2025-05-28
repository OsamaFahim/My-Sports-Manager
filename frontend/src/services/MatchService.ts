import api from './api';
import { Match } from '../contexts/MatchContext';

// Get all matches
export async function getMatches(): Promise<Match[]> {
  const res = await api.get('/matches');
  return res.data;
}

// Create a new match
export async function createMatch(match: Omit<Match, '_id'>) {
  const res = await api.post('/matches', match);
  return res.data;
}

// Update a match
export async function updateMatch(id: string, match: Partial<Match>) {
  const res = await api.put(`/matches/${id}`, match);
  return res.data;
}

// Delete a match
export async function deleteMatch(id: string) {
  const res = await api.delete(`/matches/${id}`);
  return res.data;
}