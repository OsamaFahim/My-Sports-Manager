import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  userId: string | null;
  setAuthenticated: (auth: boolean, token?: string) => void;
  logout: () => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserDataFromToken(token: string | null): { username: string | null; userId: string | null } {
  if (!token) return { username: null, userId: null };
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { username: payload.username, userId: payload.userId };
  } catch {
    return { username: null, userId: null };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
    const userData = getUserDataFromToken(token);
    setUsername(userData.username);
    setUserId(userData.userId);
    setAuthLoading(false);
  }, []);

  const setAuthenticated = (auth: boolean, token?: string) => {
    if (auth && token) {
      sessionStorage.setItem('token', token);
      setIsAuthenticated(true);
      const userData = getUserDataFromToken(token);
      setUsername(userData.username);
      setUserId(userData.userId);
    } else if (!auth) {
      setIsAuthenticated(false);
      setUsername(null);
      setUserId(null);
      sessionStorage.removeItem('token');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setUserId(null);
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, userId, setAuthenticated, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}