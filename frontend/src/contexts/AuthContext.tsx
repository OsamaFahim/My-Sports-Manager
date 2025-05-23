import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean; //true/false: is the user logged in?
  username: string | null;  //username if logged in, otherwise null
  setAuthenticated: (auth: boolean, username?: string | null) => void; //login function
  logout: () => void;  //logout function
}

//a context is a special react object that allows values to be shared globally without passing props down globally.
//We are creating a contect, so that it can be used to check whether the user has been logged in or logout.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//This warps the whole Authenticaltion logic, providing auth values to any componenet that wants them.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const setAuthenticated = (auth: boolean, usernameValue?: string | null) => {
    setIsAuthenticated(auth);
    setUsername(auth ? usernameValue || null : null);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

//a custom hook, it is basically shortcut to use the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}