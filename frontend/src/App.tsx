import ProtectedRoute from './components/ProtectedRoute';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { TeamProvider } from './contexts/TeamContext';
import { MatchProvider } from './contexts/MatchContext';
import { GroundProvider } from './contexts/GroundContext';
import { DiscussionProvider } from './contexts/DiscussionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import TeamsPage from './components/Teams/TeamsPage';
import MatchesPage from './components/Matches/MatchesPage';
import GroundsPage from './components/Grounds/GroundsPage';
import DiscussionsPage from './components/Discussions/DiscussionsPage';
import NotificationsPage from './components/Notifications/NotificationsPage';
import ProductsPage from './components/Products/ProductsPage';
import ShopPage from './components/Shop/ShopPage';
import CheckoutPage from './components/Checkout/CheckoutPage';
import TrackingPage from './components/Tracking/TrackingPage';
import FinancialStatisticsPage from './components/Statistics/FinancialStatisticsPage';
import NotificationBell from './components/Notifications/NotificationBell';
import FloatingCart from './components/Cart/FloatingCart';
import './components/Notifications/floatingBell.css';

const App: React.FC = () => {
  const [showForm, setShowForm] = useState<'none' | 'login' | 'signup'>('none');
  return (
    <AuthProvider>
      <TeamProvider>
        <MatchProvider>
          <GroundProvider>
            <DiscussionProvider>              <NotificationProvider>
                <ProductProvider>
                  <CartProvider>
                    <BrowserRouter>                    <div style={{ position: 'relative', minHeight: '100vh' }}>
                      <Navbar onAuthAction={setShowForm} />
                      {/* Place NotificationBell absolutely within the main layout */}
                      <NotificationBell />
                      <FloatingCart />                      <Routes>
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
                            <TeamsPage />
                          }
                        />
                        <Route
                          path="/matches"
                          element={
                              <MatchesPage />
                          }
                        />
                        <Route
                          path="/grounds"
                          element={
                              <GroundsPage />
                          }
                        />                        <Route
                          path="/notifications"
                          element={
                            <ProtectedRoute>
                              <NotificationsPage />
                            </ProtectedRoute>
                          }
                        />                        <Route
                          path="/products"
                          element={
                            <ProtectedRoute resourceName="products">
                              <ProductsPage />
                            </ProtectedRoute>
                          }
                        />                        <Route
                          path="/shop"
                          element={<ShopPage />}
                        />                        <Route
                          path="/checkout"
                          element={<CheckoutPage />}
                        />                        <Route
                          path="/tracking"
                          element={<TrackingPage />}
                        />
                        <Route
                          path="/financial-statistics"
                          element={
                            <ProtectedRoute resourceName="financial statistics">
                              <FinancialStatisticsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/discussions"
                          element={<DiscussionsPage />}
                        />                      </Routes>
                    </div></BrowserRouter>
                  </CartProvider>
                </ProductProvider>
              </NotificationProvider>
            </DiscussionProvider>
          </GroundProvider>
        </MatchProvider>
      </TeamProvider>
    </AuthProvider>
  );
};

export default App;