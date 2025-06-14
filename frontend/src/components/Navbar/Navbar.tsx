import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../contexts/AuthContext';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import HamburgerIcon from '../HamburgerIcon/HamburgerIcon';

interface NavbarProps {
  onAuthAction?: (action: 'none' | 'login' | 'signup') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthAction }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleLogout = () => {
    logout();
    onAuthAction?.('none');
    navigate('/', { replace: true });
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Sportify</div>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={pathname === '/' ? styles.active : undefined}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/teams" className={pathname === '/teams' ? styles.active : undefined}>
              Teams
            </Link>
          </li>
          <li>
            <Link to="/matches" className={pathname === '/matches' ? styles.active : undefined}>
              Matches
            </Link>
          </li>
          <li>
            <Link to="/grounds" className={pathname === '/grounds' ? styles.active : undefined}>
              Grounds
            </Link>
          </li>
          <li>
            <Link to="/discussions" className={pathname === '/discussions' ? styles.active : undefined}>
              Discussions
            </Link>
          </li>
          <li>
            <Link to="/shop" className={pathname === '/shop' ? styles.active : undefined}>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/tracking" className={pathname === '/tracking' ? styles.active : undefined}>
              Tracking
            </Link>
          </li>
          {/* Only show these links if authenticated */}
          {isAuthenticated && (
            <>
              <li>
                <Link to="/products" className={pathname === '/products' ? styles.active : undefined}>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/financial-statistics" className={pathname === '/financial-statistics' ? styles.active : undefined}>
                  Financial Reports
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className={styles.navButtons}>
          {!isAuthenticated ? (
            <>
              {pathname === '/' && (
                <>
                  <button
                    className={`${styles.authButton} ${styles.signupBtn}`}
                    onClick={() => onAuthAction?.('signup')}
                    type="button"
                  >
                    Create Account
                  </button>
                  <button
                    className={`${styles.authButton} ${styles.loginBtn}`}
                    onClick={() => onAuthAction?.('login')}
                    type="button"
                  >
                    Login
                  </button>
                </>
              )}
            </>
          ) : (
            <div className={styles.authSection}>
              <span className={styles.welcome}>
                Welcome{username ? `, ${username}` : ''}!
              </span>
              <button
                className={`${styles.authButton} ${styles.loginBtn}`}
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <div className={styles.mobileMenuButton}>
          <HamburgerIcon isOpen={isDrawerOpen} onClick={toggleDrawer} />
        </div>
      </nav>
      <MobileDrawer 
        isOpen={isDrawerOpen} 
        onClose={closeDrawer}
        onAuthAction={onAuthAction}
      />
    </>
  );
};

export default Navbar;