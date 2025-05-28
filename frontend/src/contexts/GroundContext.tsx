import React, { createContext, useContext, useEffect, useState } from 'react';
import * as groundService from '../services/GroundService';
import { useAuth } from './AuthContext';

export interface Ground {
  _id?: string;
  name: string;
  location: string;
  capacity: number;
  facilities: string;
}

interface GroundContextType {
  grounds: Ground[];
  loading: boolean;
  error: string | null;
  fetchGrounds: () => Promise<void>;
  addGround: (ground: Omit<Ground, '_id'>) => Promise<void>;
  updateGround: (id: string, ground: Partial<Ground>) => Promise<void>;
  deleteGround: (id: string) => Promise<void>;
}

const GroundContext = createContext<GroundContextType | undefined>(undefined);

export const GroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrounds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groundService.getGrounds();
      setGrounds(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setGrounds([]);
      setError(err?.response?.data?.message || 'Failed to fetch grounds');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGrounds();
    } else {
      setGrounds([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addGround = async (ground: Omit<Ground, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      await groundService.createGround(ground);
      await fetchGrounds();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add ground');
    } finally {
      setLoading(false);
    }
  };

  const updateGround = async (id: string, ground: Partial<Ground>) => {
    setLoading(true);
    setError(null);
    try {
      await groundService.updateGround(id, ground);
      await fetchGrounds();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update ground');
    } finally {
      setLoading(false);
    }
  };

  const deleteGround = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await groundService.deleteGround(id);
      await fetchGrounds();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete ground');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GroundContext.Provider value={{ grounds, loading, error, fetchGrounds, addGround, updateGround, deleteGround }}>
      {children}
    </GroundContext.Provider>
  );
};

export function useGrounds() {
  const ctx = useContext(GroundContext);
  if (!ctx) throw new Error('useGrounds must be used within GroundProvider');
  return ctx;
}