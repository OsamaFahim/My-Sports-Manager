import React from 'react';
import AuthForm from './Auth/AuthForm';
import styles from './MainPage/MainPage.module.css';

interface LandingPageProps {
  showForm: 'none' | 'login' | 'signup';
  setShowForm: (form: 'none' | 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ showForm, setShowForm }) => {
  if (showForm === 'none') {
    return (
      <div className={styles.authFormContainer}>
        <h2 className={styles.authTitle}>Welcome to Sportify</h2>
        <p className={styles.authSubtitle}>
          Your all-in-one platform for sports team management
        </p>

        <div className={styles.welcomeContent}>
          <p>
            Create teams, schedule matches, manage tickets, and track performance
            with our comprehensive sports management solution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.backButton}>
        <button onClick={() => setShowForm('none')} className={styles.backLink}>
          ← Back to welcome
        </button>
      </div>
      <AuthForm defaultIsLogin={showForm === 'login'} />
    </>
  );
};

export default LandingPage;