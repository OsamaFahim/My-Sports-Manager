import React from 'react';
import styles from '../MainPage/MainPage.module.css';

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = true,
}) => (
  <div className={styles.formGroup}>
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      className={styles.authInput}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
    {error && <div className={styles.errorMessage}>{error}</div>}
  </div>
);

export default AuthInput;