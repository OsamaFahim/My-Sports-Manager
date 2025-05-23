import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthLayout from './components/Auth/AuthLayout';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  // Move the form state here
  const [showForm, setShowForm] = useState<'none' | 'login' | 'signup'>('none');

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar onAuthAction={setShowForm} />
        <AuthLayout>
          <LandingPage showForm={showForm} setShowForm={setShowForm} />
        </AuthLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;