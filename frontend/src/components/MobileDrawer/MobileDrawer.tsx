import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './MobileDrawer.module.css';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthAction?: (action: 'login' | 'signup') => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onAuthAction }) => {
  const { pathname } = useLocation();
  const { isAuthenticated, username, logout } = useAuth();

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/teams', label: 'Teams' },
    { path: '/matches', label: 'Matches' },
    { path: '/grounds', label: 'Grounds' },
    { path: '/Discussions', label: 'Discussions' },
    { path: '/products', label: 'Products' },
    { path: '/shop', label: 'Shop' },
    { path: '/tracking', label: 'Track Order' },
    { path: '/financial-statistics', label: 'Financial Reports' },
  ];

  const handleLinkClick = () => {
    onClose();
  };

  const handleAuthAction = (action: 'login' | 'signup') => {
    onAuthAction?.(action);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Sportify</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            <span className={styles.closeIcon}>×</span>
          </button>
        </div>

        {/* User Section */}
        {isAuthenticated && (
          <div className={styles.userSection}>
            <div className={styles.welcomeMessage}>
              Welcome{username ? `, ${username}` : ''}!
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className={styles.drawerNav}>
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.drawerLink} ${pathname === item.path ? styles.drawerLinkActive : ''}`}
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className={styles.authSection}>
          {!isAuthenticated ? (
            <>
              {pathname === '/' && (
                <>
                  <button
                    className={`${styles.authButton} ${styles.signupBtn}`}
                    onClick={() => handleAuthAction('signup')}
                    type="button"
                  >
                    Create Account
                  </button>
                  <button
                    className={`${styles.authButton} ${styles.loginBtn}`}
                    onClick={() => handleAuthAction('login')}
                    type="button"
                  >
                    Login
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              className={`${styles.authButton} ${styles.logoutBtn}`}
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
