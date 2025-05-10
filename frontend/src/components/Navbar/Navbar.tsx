import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './navbar.module.css';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onAuthAction?: (action: 'login' | 'signup') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthAction }) => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const { isAuthenticated, username, logout } = useAuth(); // handle here

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Sportify</div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={pathname === '/' ? styles.active : undefined}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/teams"
            className={pathname === '/teams' ? styles.active : undefined}
          >
            Teams
          </Link>
        </li>
        <li>
          <Link
            to="/matches"
            className={pathname === '/matches' ? styles.active : undefined}
          >
            Matches
          </Link>
        </li>
        <li>
          <Link
            to="/stats"
            className={pathname === '/stats' ? styles.active : undefined}
          >
            Stats
          </Link>
        </li>
      </ul>

      {isLanding && (
        <div className={styles.navButtons}>
          {!isAuthenticated ? (
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
          ) : (
            <>
              <span className={styles.logo}>
                Welcome{username ? `, ${username}` : ''}!
              </span>
              <button
                className={`${styles.authButton} ${styles.loginBtn}`}
                onClick={logout}
                type="button"
                style={{ marginLeft: 12 }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;