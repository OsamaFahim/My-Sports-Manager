import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  setAuthenticated: (auth: boolean, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUsernameFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.username || null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Sync token on first mount
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
    setUsername(getUsernameFromToken(token));
  }, []);

  const setAuthenticated = (auth: boolean, token?: string) => {
    if (auth && token) {
      sessionStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUsername(getUsernameFromToken(token));
    } else if (!auth) {
      setIsAuthenticated(false);
      setUsername(null);
      sessionStorage.removeItem('token');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
