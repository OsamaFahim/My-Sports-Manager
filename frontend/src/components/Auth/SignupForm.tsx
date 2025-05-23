import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';
import AuthInput from './AuthInput';
import AuthCheckbox from './AuthCheckbox';

interface SignupFormProps {
  formData: {
    email: string;
    password: string;
    username?: string;
    confirm_password?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  formErrors?: {
    username?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
  };
}

const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  onChange,
  onSubmit,
  formErrors = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
      <AuthInput
        id="username"
        label="Username"
        value={formData.username || ''}
        onChange={onChange}
        placeholder="Enter your username"
        error={formErrors.username}
      />
      <AuthInput
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Enter your email"
        error={formErrors.email}
      />
      <AuthInput
        id="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={onChange}
        placeholder="Enter your password"
        error={formErrors.password}
      />
      <div className={styles.formOptions}>
        <AuthCheckbox
          id="showPassword"
          label="Show Password"
          checked={showPassword}
          onChange={() => setShowPassword((prev) => !prev)}
        />
      </div>
      <AuthInput
        id="confirm_password"
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirm_password || ''}
        onChange={onChange}
        placeholder="Confirm your password"
        error={formErrors.confirm_password}
      />
      <div className={styles.formOptions}>
        <AuthCheckbox
          id="showConfirmPassword"
          label="Show Confirm Password"
          checked={showConfirmPassword}
          onChange={() => setShowConfirmPassword((prev) => !prev)}
        />
      </div>
      <button type="submit" className={styles.authButton}>
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;