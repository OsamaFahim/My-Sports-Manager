//
import React, { useState, useEffect } from 'react';
import AuthForm from './Auth/AuthForm';
import styles from './LandingPage.module.css';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  showForm: 'none' | 'login' | 'signup';
  setShowForm: (form: 'none' | 'login' | 'signup') => void;
}

const ImageSlider: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    '/Images/slider1.jpg',
    '/Images/slider2.jpg',
    '/Images/slider3.jpg',
    '/Images/slider4.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const handleDotClick = (index: number) => {
    setCurrentImage(index);
  };

  const handleDotKeyPress = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setCurrentImage(index);
    }
  };

  return (
    <div className={styles.imageSlider}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Sports Action ${index + 1}`}
          className={`${styles.sliderImage} ${index === currentImage ? styles.active : ''}`}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <div className={styles.sliderDots}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${index === currentImage ? styles.active : ''}`}
            onClick={() => handleDotClick(index)}
            onKeyDown={(e) => handleDotKeyPress(e, index)}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const WelcomeSection: React.FC<{ setShowForm: (form: 'none' | 'login' | 'signup') => void }> = ({ setShowForm }) => (
  <div className={styles.landingContainer}>
    {/* Hero Section with Image Slider */}
    <section className={styles.heroSection}>
      <div className={styles.imageSliderContainer}>
        <ImageSlider />
        <div className={styles.heroOverlay} />
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Sportify</h1>
        <h2 className={styles.heroSubtitle}>Your Ultimate Sports Management Platform</h2>
        <p className={styles.heroDescription}>
          Create teams, schedule matches, manage tickets, and track performance with our comprehensive sports management solution. Built for coaches, players, and sports organizations of all sizes.
        </p>
        <div className={styles.ctaButtons}>
          <button 
            className={`${styles.ctaButton} ${styles.ctaPrimary}`}
            onClick={() => setShowForm('signup')}
          >
            Get Started Free
          </button>
          <button 
            className={`${styles.ctaButton} ${styles.ctaSecondary}`}
            onClick={() => setShowForm('login')}
          >
            Sign In
          </button>
        </div>
      </div>
    </section>    {/* Features Section */}
    <section className={`${styles.featuresSection} ${styles.fullWidthSection}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Everything You Need to Manage Your Team</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏆</div>
            <h3 className={styles.featureTitle}>Team Management</h3>
            <p className={styles.featureDescription}>
              Create and organize teams, manage player rosters, and track team statistics with ease.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📅</div>
            <h3 className={styles.featureTitle}>Match Scheduling</h3>
            <p className={styles.featureDescription}>
              Schedule matches, tournaments, and training sessions with our intuitive calendar system.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎫</div>
            <h3 className={styles.featureTitle}>Ticket Management</h3>
            <p className={styles.featureDescription}>
              Sell tickets, manage attendance, and track revenue from your sporting events.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Performance Analytics</h3>
            <p className={styles.featureDescription}>
              Track team and player performance with detailed statistics and visual reports.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💬</div>
            <h3 className={styles.featureTitle}>Communication Tools</h3>
            <p className={styles.featureDescription}>
              Keep your team connected with built-in messaging and notification systems.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>Secure & Reliable</h3>
            <p className={styles.featureDescription}>
              Your data is protected with enterprise-grade security and reliable cloud infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>    {/* Stats Section */}
    <section className={`${styles.statsSection} ${styles.fullWidthSection}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Trusted by Sports Organizations Worldwide</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>10K+</div>
            <div className={styles.statLabel}>Teams Managed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>50K+</div>
            <div className={styles.statLabel}>Matches Scheduled</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>100K+</div>
            <div className={styles.statLabel}>Tickets Sold</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>25+</div>
            <div className={styles.statLabel}>Countries</div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ showForm, setShowForm }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated || showForm === 'none') {
    return <WelcomeSection setShowForm={setShowForm} />;
  }
  
  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authPageContent}>
        <div className={styles.backButton}>
          <button onClick={() => setShowForm('none')} className={styles.backLink}>
            ← Back to welcome
          </button>
        </div>
        <AuthForm defaultIsLogin={showForm === 'login'} />
      </div>
    </div>
  );
};

export default LandingPage;