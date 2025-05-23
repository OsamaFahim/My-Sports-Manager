import React from 'react';
import styles from '../MainPage/MainPage.module.css';

interface AuthCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

const AuthCheckbox: React.FC<AuthCheckboxProps> = ({ id, label, checked, onChange }) => (
  <div className={styles.rememberMe}>
    <input
      type="checkbox"
      id={id}
      className={styles.checkbox}
      checked={checked}
      onChange={onChange}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);

export default AuthCheckbox;