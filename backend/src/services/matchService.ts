import Match, { IMatch } from '../models/Match';

export async function getAllMatches(): Promise<IMatch[]> {
  return Match.find().lean(); 
}

export async function getMatchesByUsername(username: string): Promise<IMatch[]> {
  return Match.find({ username });
}

export async function createMatch(username: string, data: any): Promise<IMatch> {
  return Match.create({ ...data, username });
}

export async function updateMatch(id: string, data: any): Promise<IMatch | null> {
  return Match.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteMatch(id: string): Promise<IMatch | null> {
  return Match.findByIdAndDelete(id);
}