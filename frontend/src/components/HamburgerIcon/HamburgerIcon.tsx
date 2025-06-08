import React from 'react';
import styles from './HamburgerIcon.module.css';

interface HamburgerIconProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
    </button>
  );
};

export default HamburgerIcon;
