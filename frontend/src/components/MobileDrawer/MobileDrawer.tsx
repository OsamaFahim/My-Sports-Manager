import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './MobileDrawer.module.css';
import { useAuth } from '../../contexts/AuthContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthAction?: (action: 'none' | 'login' | 'signup') => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onAuthAction }) => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>×</button>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={pathname === '/' ? styles.active : undefined} onClick={onClose}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/teams" className={pathname === '/teams' ? styles.active : undefined} onClick={onClose}>
            Teams
          </Link>
        </li>
        <li>
          <Link to="/matches" className={pathname === '/matches' ? styles.active : undefined} onClick={onClose}>
            Matches
          </Link>
        </li>
        <li>
          <Link to="/grounds" className={pathname === '/grounds' ? styles.active : undefined} onClick={onClose}>
            Grounds
          </Link>
        </li>
        <li>
          <Link to="/discussions" className={pathname === '/discussions' ? styles.active : undefined} onClick={onClose}>
            Discussions
          </Link>
        </li>
        <li>
          <Link to="/shop" className={pathname === '/shop' ? styles.active : undefined} onClick={onClose}>
            Shop
          </Link>
        </li>
        <li>
          <Link to="/tracking" className={pathname === '/tracking' ? styles.active : undefined} onClick={onClose}>
            Tracking
          </Link>
        </li>
        {/* Only show these links if authenticated */}
        {isAuthenticated && (
          <>
            <li>
              <Link to="/products" className={pathname === '/products' ? styles.active : undefined} onClick={onClose}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/financial-statistics" className={pathname === '/financial-statistics' ? styles.active : undefined} onClick={onClose}>
                Financial Reports
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default MobileDrawer;