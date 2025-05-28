//frontend/src/components/ProtectedRoute.tsx
//This component checks if the user is authenticated before rendering
// the protected route.

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  resourceName?: string; // e.g. "grounds", "matches", "teams"
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, resourceName = "this page" }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Only logged in users can access and manage {resourceName}.</h2>
        <p>Please log in or sign up to continue.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;