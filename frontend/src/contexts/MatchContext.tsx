import React, { createContext, useContext, useEffect, useState } from 'react';
import * as matchService from '../services/MatchService';
import { useAuth } from './AuthContext';

export interface Match {
  _id?: string;
  teamA: string;
  teamB: string;
  ground: string;
  datetime: string; // ISO string
}

interface MatchContextType {
  matches: Match[];
  loading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  addMatch: (match: { teamA: string; teamB: string; ground: string; date: string; time: string }) => Promise<void>;
  updateMatch: (id: string, match: { teamA: string; teamB: string; ground: string; date: string; time: string }) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchService.getMatches();
      setMatches(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setMatches([]);
      setError(err?.response?.data?.message || 'Failed to fetch matches');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMatches();
    } else {
      setMatches([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Accepts date and time, combines to datetime before sending to backend
  const addMatch = async (match: { teamA: string; teamB: string; ground: string; date: string; time: string }) => {
    setLoading(true);
    try {
      const datetime = new Date(`${match.date}T${match.time}`).toISOString();
      await matchService.createMatch({
        teamA: match.teamA,
        teamB: match.teamB,
        ground: match.ground,
        datetime,
      });
      await fetchMatches();
    } catch (err: any) {
      throw err; // <-- propagate error so MatchForm can display it
    }
    setLoading(false);
  };

  // Accepts date and time, combines to datetime before sending to backend
  const updateMatch = async (id: string, match: { teamA: string; teamB: string; ground: string; date: string; time: string }) => {
    setLoading(true);
    try {
      const datetime = new Date(`${match.date}T${match.time}`).toISOString();
      await matchService.updateMatch(id, {
        teamA: match.teamA,
        teamB: match.teamB,
        ground: match.ground,
        datetime,
      });
      await fetchMatches();
    } catch (err: any) {
      throw err;
    }
    setLoading(false);
  };

  const deleteMatch = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await matchService.deleteMatch(id);
      await fetchMatches();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete match');
    }
    setLoading(false);
  };

  return (
    <MatchContext.Provider value={{ matches, loading, error, fetchMatches, addMatch, updateMatch, deleteMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export function useMatches() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error('useMatches must be used within MatchProvider');
  return ctx;
}