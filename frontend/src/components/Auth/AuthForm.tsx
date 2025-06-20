// components/auth/AuthForm.tsx
import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { signup, login } from '../../services/authService';
//Validating Data from Login and Signup
import { validateSignupForm, SignupFormValues } from '../../utils/Validations/SignupValidation';
import { validateLoginForm } from '../../utils/Validations/LoginValidation';
import { useAuth } from '../../contexts/AuthContext';
const AuthForm: React.FC<{ defaultIsLogin?: boolean }> = ({ defaultIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [formData, setFormData] = useState({
    email: '', 
    password: '',
    username: '',
    confirm_password: ''
  });
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof SignupFormValues, string>>>({});
  const { setAuthenticated } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setFormErrors(prev => ({ ...prev, [id]: ''}));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid: boolean;
    let errors: Partial<Record<keyof SignupFormValues, string>>;

    if (!isLogin) {
      //Use signup Validations
      const result = await validateSignupForm(formData);
      isValid = result.isValid;
      errors = result.errors;
    } else {
      //User Login validation
      const result = await validateLoginForm(formData);
      isValid = result.isValid;
      errors = result.errors;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    if (!isLogin) {
      try {
        //Signup API call so that request is sent to backend to the route '/api/auth/signup' and the route will be handled by the controller
        const result = await signup({      
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setAuthenticated(true, result.token); 
        alert('Signup successful!');
      } catch (error: unknown) {
        const errorMessage = error && typeof error === 'object' && 'response' in error 
          ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Signup failed'
          : 'Signup failed';
        alert(errorMessage);
      }
    } else {
      try {
        //Login API call so that request is sent to backend to the route '/api/auth/login' and the route will be handled by the controller
        const result = await login({
          username: formData. username,
          password: formData. password
        });
        setAuthenticated(true, result.token);
        alert('Login successful'); 
      } catch (error: unknown) {
        const errorMessage = error && typeof error === 'object' && 'response' in error 
          ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed'
          : 'Login failed';
        alert(errorMessage);
      }
    }
  };

  return (
    <div className={styles.authFormContainer}>
      <div className={styles.authTabs}>
        <button
          className={`${styles.authTab} ${isLogin ? styles.activeTab : ''}`}
          onClick={() => setIsLogin(true)}
          type="button"
        >
          Login
        </button>
        <button
          className={`${styles.authTab} ${!isLogin ? styles.activeTab : ''}`}
          onClick={() => setIsLogin(false)}
          type="button"
        >
          Signup
        </button>
      </div>

      <h2 className={styles.authTitle}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className={styles.authSubtitle}>
        {isLogin
          ? 'Sign in to manage your sports teams and events'
          : 'Join Sportify to start managing your sports organization'}
      </p>      {/*Forms*/}
      {isLogin ? (
        <LoginForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
      ) : (   
        <SignupForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} formErrors = {formErrors}/>
      )}

      <div className={styles.authSwitch}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setIsLogin(prev => !prev)}
          className={styles.authLink}
          type="button"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
