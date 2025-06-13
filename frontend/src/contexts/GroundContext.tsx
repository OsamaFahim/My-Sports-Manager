import React, { createContext, useContext, useState, useEffect } from 'react';
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
  fetchGrounds: () => Promise<void>;
  addGround: (ground: Omit<Ground, '_id'>) => Promise<void>;
  updateGround: (id: string, ground: Partial<Ground>) => Promise<void>;
  deleteGround: (id: string) => Promise<void>;
  isPublicView: boolean;
}

const GroundContext = createContext<GroundContextType | undefined>(undefined);

export const GroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublicView, setIsPublicView] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchGrounds = async () => {
    setLoading(true);
    try {
      const data = await groundService.getGrounds();
      setGrounds(data);
      setIsPublicView(false); // <-- THIS IS CRUCIAL
    } catch {
      setGrounds([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGrounds = async () => {
    setLoading(true);
    try {
      const data = await groundService.getAllGrounds();
      setGrounds(data);
      setIsPublicView(true); // <-- THIS IS CRUCIAL
    } catch {
      setGrounds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGrounds();
    } else {
      fetchAllGrounds();
    }
  }, [isAuthenticated]);

  const addGround = async (ground: Omit<Ground, '_id'>) => {
    await groundService.createGround(ground);
    await fetchGrounds();
  };

  const updateGround = async (id: string, ground: Partial<Ground>) => {
    await groundService.updateGround(id, ground);
    await fetchGrounds();
  };

  const deleteGround = async (id: string) => {
    await groundService.deleteGround(id);
    await fetchGrounds();
  };

  return (
    <GroundContext.Provider
      value={{
        grounds,
        loading,
        fetchGrounds,
        addGround,
        updateGround,
        deleteGround,
        isPublicView,
      }}
    >
      {children}
    </GroundContext.Provider>
  );
};

export const useGrounds = () => {
  const ctx = useContext(GroundContext);
  if (!ctx) throw new Error('useGrounds must be used within GroundProvider');
  return ctx;
};