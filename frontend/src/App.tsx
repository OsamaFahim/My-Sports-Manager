import ProtectedRoute from './components/ProtectedRoute';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './components/Auth/AuthLayout';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { TeamProvider } from './contexts/TeamContext';
import TeamsPage from './components/Teams/TeamsPage';

const App: React.FC = () => {
  const [showForm, setShowForm] = useState<'none' | 'login' | 'signup'>('none');

  return (
    <AuthProvider>
      <TeamProvider>
        <BrowserRouter>
          <Navbar onAuthAction={setShowForm} />
          <AuthLayout>
            <Routes>
              <Route path="/" element={<LandingPage showForm={showForm} setShowForm={setShowForm} />} />
              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <TeamsPage />
                  </ProtectedRoute>
                }
              />
              {/*Later I will add other protected routes here*/}
            </Routes>
          </AuthLayout>
        </BrowserRouter>
      </TeamProvider>
    </AuthProvider>
  );
};

export default App;