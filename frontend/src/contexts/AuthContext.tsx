import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean; //true/false: is the user logged in?
  username: string | null;  //username if logged in, otherwise null
  setAuthenticated: (auth: boolean, token?: string) => void; //login function (removed username param)
  logout: () => void;  //logout function
}

//a context is a special react object that allows values to be shared globally without passing props down globally.
//We are creating a contect, so that it can be used to check whether the user has been logged in or logout.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Helper function to decode the username from JWT
function getUsernameFromToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  try {
    const decoded: any = jwtDecode(token);
    return decoded.username || null;
  } catch {
    return null;
  }
}

//This warps the whole Authenticaltion logic, providing auth values to any componenet that wants them.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = sessionStorage.getItem('token');  
  const [isAuthenticated, setIsAuthenticated] = useState(!!token); // Check if token exists in sessionStorage to set initial auth state
  const [username, setUsername] = useState<string | null>(getUsernameFromToken(token));

  const setAuthenticated = (auth: boolean, token?: string) => {
    setIsAuthenticated(auth); 
    //If the user is authenticated, we store the token in sessionStorage and set the username from the decoded token.
    if (auth && token) {
      sessionStorage.setItem('token', token); // Store token in sessionStorage
      setUsername(getUsernameFromToken(token));
    } else {
      setUsername(null);
      sessionStorage.removeItem('token'); // Remove token from sessionStorage if not authenticated
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

//a custom hook, it is basically shortcut to use the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}