import ProtectedRoute from './components/ProtectedRoute';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './components/Auth/AuthLayout';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { TeamProvider } from './contexts/TeamContext';
import { MatchProvider } from './contexts/MatchContext';
import { GroundProvider } from './contexts/GroundContext';
import { DiscussionProvider } from './contexts/DiscussionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import TeamsPage from './components/Teams/TeamsPage';
import MatchesPage from './components/Matches/MatchesPage';
import GroundsPage from './components/Grounds/GroundsPage';
import DiscussionsPage from './components/Discussions/DiscussionsPage';
import NotificationsPage from './components/Notifications/NotificationsPage';
import NotificationBell from './components/Notifications/NotificationBell';
import './components/Notifications/floatingBell.css';

const App: React.FC = () => {
  const [showForm, setShowForm] = useState<'none' | 'login' | 'signup'>('none');

  return (
    <AuthProvider>
      <TeamProvider>
        <MatchProvider>
          <GroundProvider>
            <DiscussionProvider>
              <NotificationProvider>
                <BrowserRouter>
                  <div style={{ position: 'relative', minHeight: '100vh' }}>
                    <Navbar onAuthAction={setShowForm} />
                    {/* Place NotificationBell absolutely within the main layout */}
                    <NotificationBell />
                    <AuthLayout>
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <LandingPage
                              showForm={showForm}
                              setShowForm={setShowForm}
                            />
                          }
                        />
                        <Route
                          path="/teams"
                          element={
                            <ProtectedRoute resourceName="teams">
                              <TeamsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/matches"
                          element={
                            <ProtectedRoute resourceName="matches">
                              <MatchesPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/grounds"
                          element={
                            <ProtectedRoute resourceName="grounds">
                              <GroundsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/notifications"
                          element={
                            <ProtectedRoute>
                              <NotificationsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/discussions"
                          element={<DiscussionsPage />}
                        />
                      </Routes>
                    </AuthLayout>
                  </div>
                </BrowserRouter>
              </NotificationProvider>
            </DiscussionProvider>
          </GroundProvider>
        </MatchProvider>
      </TeamProvider>
    </AuthProvider>
  );
};

export default App;