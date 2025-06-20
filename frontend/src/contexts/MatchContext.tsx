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
  isPublicView: boolean; 
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPublicView, setIsPublicView] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (isAuthenticated) {
        data = await matchService.getMatches();
        setIsPublicView(false);
      } else {
        data = await matchService.getAllMatches();
        setIsPublicView(true);
      }
      setMatches(data);
    } catch (err: any) {
      setError('Failed to load matches');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchAllMatches = async () => {
    setLoading(true);
    try {
      const data = await matchService.getAllMatches();
      setMatches(data);
      setIsPublicView(true);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (authLoading) return;
    fetchMatches();
  }, [isAuthenticated, authLoading]);

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
      if (isAuthenticated) { 
        await fetchMatches();
      } else {
        await fetchAllMatches(); 
      }
    } catch (err: any) {
      throw err; // <-- propagate error so MatchForm can display it
    } finally {
      setLoading(false);
    }
  }

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
      if (isAuthenticated) {
        await fetchMatches();
      } else {
        await fetchAllMatches();
      }
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMatch = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await matchService.deleteMatch(id);
      if (isAuthenticated) {
        await fetchMatches();
      } else {
        await fetchAllMatches();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MatchContext.Provider value={{ matches, loading, error, fetchMatches, addMatch, updateMatch, deleteMatch, isPublicView }}>
      {children}
    </MatchContext.Provider>
  );
};

export function useMatches() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error('useMatches must be used within MatchProvider');
  return ctx;
}