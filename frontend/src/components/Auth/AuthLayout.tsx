// components/Auth/AuthLayout.tsx
import React from 'react';
import styles from '../MainPage/MainPage.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authContent}>
        <div className={styles.authLogo}>Sportify</div>
        <div className={styles.authTagline}>Manage Teams. Schedule Matches. Track Performance.</div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;