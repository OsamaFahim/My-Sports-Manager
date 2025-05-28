import api from './api';
import { Team, Player } from '../contexts/TeamContext';

export async function getTeams(): Promise<Team[]> {
  const res = await api.get('/teams');
  return res.data;
}

export async function createTeam(team: Omit<Team, '_id'>) {
  const res = await api.post('/teams', team);
  return res.data;
}

export async function updateTeam(id: string, team: Partial<Team>) {
  const res = await api.put(`/teams/${id}`, team);
  return res.data;
}

export async function deleteTeam(id: string) {
  const res = await api.delete(`/teams/${id}`);
  return res.data;
}

export async function addPlayer(teamId: string, player: Omit<Player, '_id'>) {
  const res = await api.post(`/teams/${teamId}/players`, player);
  return res.data;
}

export async function updatePlayer(teamId: string, playerId: string, player: Partial<Player>) {
  const res = await api.put(`/teams/${teamId}/players/${playerId}`, player);
  return res.data;
}

export async function deletePlayer(teamId: string, playerId: string) {
  const res = await api.delete(`/teams/${teamId}/players/${playerId}`);
  return res.data;
}