import api from './api';
import { Ground } from '../contexts/GroundContext';

export async function getGrounds(): Promise<Ground[]> {
  const res = await api.get('/grounds');
  return res.data;
}

export async function createGround(ground: Omit<Ground, '_id'>) {
  const res = await api.post('/grounds', ground);
  return res.data;
}

export async function updateGround(id: string, ground: Partial<Ground>) {
  const res = await api.put(`/grounds/${id}`, ground);
  return res.data;
}

export async function deleteGround(id: string) {
  const res = await api.delete(`/grounds/${id}`);
  return res.data;
}