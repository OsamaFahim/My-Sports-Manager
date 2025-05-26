import React, { createContext, useContext, useState, useEffect } from 'react';
import * as teamService from '../services/TeamService';
import { useAuth } from './AuthContext';

export interface Player {
  _id?: string;
  name: string;
  age: number;
  position: string;
  stats: string;
}

export interface Team {
  _id?: string;
  name: string;
  players: Player[];
}

interface TeamContextType {
  teams: Team[];
  loading: boolean;
  fetchTeams: () => Promise<void>;
  addTeam: (team: Omit<Team, '_id'>) => Promise<void>;
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await teamService.getTeams();
      setTeams(data);
    } catch (err) {
      setTeams([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeams();
    } else {
      setTeams([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addTeam = async (team: Omit<Team, '_id'>) => {
    await teamService.createTeam(team);
    await fetchTeams();
  };

  const updateTeam = async (id: string, team: Partial<Team>) => {
    await teamService.updateTeam(id, team);
    await fetchTeams();
  };

  const deleteTeam = async (id: string) => {
    await teamService.deleteTeam(id);
    await fetchTeams();
  };

  return (
    <TeamContext.Provider value={{ teams, loading, fetchTeams, addTeam, updateTeam, deleteTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeams must be used within TeamProvider');
  return ctx;
};