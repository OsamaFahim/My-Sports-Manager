// components/auth/AuthForm.tsx
import React, { useState } from 'react';
import styles from '../MainPage/MainPage.module.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { signup } from '../../services/authService';
import { validateSignupForm, SignupFormValues } from '../../utils/Validations/SignupValidation';
import { useAuth } from '../../context/AuthContext';

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
    const {isValid, errors} = validateSignupForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    if (!isLogin) {
      try {
        //Signup API call so that request is sent to backend to the route '/api/auth/signup' and the route will be handled by the controller
        await signup({      
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setAuthenticated(true, formData.username); 
        alert('Signup successful!');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Signup failed');
      }
    } else {
      console.log('Logging in with:', formData);
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
      </p>

      {/*Forms*/}
      {isLogin ? (
        <LoginForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
      ) : (   
        <SignupForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} formErrors = {formErrors}/>
      )}

      <div className={styles.divider}>or</div>

      <div className={styles.socialLogin}>
        <button className={styles.socialButton} type="button">
          <FaGoogle className={styles.socialIcon} />
          Google
        </button>
        <button className={styles.socialButton} type="button">
          <FaFacebookF className={styles.socialIcon} />
          Facebook
        </button>
      </div>

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
