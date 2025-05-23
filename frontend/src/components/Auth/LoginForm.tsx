import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';
import AuthInput from './AuthInput';
import AuthCheckbox from './AuthCheckbox';

interface LoginFormProps {
  formData: { username: string; password: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, onChange, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
      <AuthInput
        id="username"
        label="Username"
        value={formData.username}
        onChange={onChange}
        placeholder="Enter your username"
      />
      <AuthInput
        id="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={onChange}
        placeholder="Enter your password"
      />
      <div className={styles.formOptions}>
        <AuthCheckbox
          id="showPassword"
          label="Show Password"
          checked={showPassword}
          onChange={() => setShowPassword((prev) => !prev)}
        />
        {/* <div className={styles.forgotPassword}>
          <a href="#" className={styles.authLink}>Forgot password?</a>
        </div> */}
      </div>
      <button type="submit" className={styles.authButton}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;