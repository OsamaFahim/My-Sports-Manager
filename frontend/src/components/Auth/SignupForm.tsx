import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';

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

  const renderInputField = ({
    id,
    label,
    type,
    placeholder,
    value,
    error,
    showToggle,
    isVisible,
    toggleVisibility,
  }: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value?: string;
    error?: string;
    showToggle?: boolean;
    isVisible?: boolean;
    toggleVisibility?: () => void;
  }) => (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        type={showToggle ? (isVisible ? 'text' : 'password') : type}
        id={id}
        className={styles.authInput}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
      {showToggle && toggleVisibility && (
        <label className={styles.checkboxLabel}>
          <input type="checkbox" checked={isVisible} onChange={toggleVisibility} /> Show {label}
        </label>
      )}
    </div>
  );

  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
      {renderInputField({
        id: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'Enter your username',
        value: formData.username,
        error: formErrors.username,
      })}

      {renderInputField({
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
        value: formData.email,
        error: formErrors.email,
      })}

      {renderInputField({
        id: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        value: formData.password,
        error: formErrors.password,
        showToggle: true,
        isVisible: showPassword,
        toggleVisibility: () => setShowPassword(prev => !prev),
      })}

      {renderInputField({
        id: 'confirm_password',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm your password',
        value: formData.confirm_password,
        error: formErrors.confirm_password,
        showToggle: true,
        isVisible: showConfirmPassword,
        toggleVisibility: () => setShowConfirmPassword(prev => !prev),
      })}

      <button type="submit" className={styles.authButton}>
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
