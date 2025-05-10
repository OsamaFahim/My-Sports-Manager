// components/Auth/LoginForm.tsx
import React from 'react';
import styles from '../MainPage/MainPage.module.css';

interface LoginFormProps {
  formData: { email: string; password: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, onChange, onSubmit }) => (
  <form className={styles.AuthForm} onSubmit={onSubmit}>
    <div className={styles.formGroup}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        className={styles.authInput}
        placeholder="Enter your email"
        value={formData.email}
        onChange={onChange}
        required
      />
    </div>

    <div className={styles.formGroup}>
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        className={styles.authInput}
        placeholder="Enter your password"
        value={formData.password}
        onChange={onChange}
        required
      />
    </div>

    <div className={styles.formOptions}>
      <div className={styles.rememberMe}>
        <input type="checkbox" id="remember" className={styles.checkbox} />
        <label htmlFor="remember">Remember me</label>
      </div>
      <div className={styles.forgotPassword}>
        <a href="#" className={styles.authLink}>Forgot password?</a>
      </div>
    </div>

    <button type="submit" className={styles.authButton}>
      Login
    </button>
  </form>
);

export default LoginForm;
