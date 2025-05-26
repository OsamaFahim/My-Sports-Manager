//frontend/src/components/ProtectedRoute.tsx
//This component checks if the user is authenticated before rendering
// the protected route.

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>You must be logged in to view this page.</h2>
        <p>Please log in or sign up to manage your teams.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;