import React, { useState } from 'react';
import styles from './checkout.module.css';

interface GuestDetails {
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
}

interface GuestFormProps {
  onSubmit: (details: GuestDetails) => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<GuestDetails>({
    email: '',
    mobile: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState<Partial<GuestDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<GuestDetails> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof GuestDetails]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className={styles.guestForm}>
      <h2 className={styles.formTitle}>Your Details</h2>
      <p className={styles.formSubtitle}>
        Please provide your details to complete the purchase
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.label}>
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <span className={styles.errorText}>{errors.firstName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <span className={styles.errorText}>{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.error : ''}`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="mobile" className={styles.label}>
            Mobile Number *
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={`${styles.input} ${errors.mobile ? styles.error : ''}`}
            placeholder="Enter your mobile number"
          />
          {errors.mobile && (
            <span className={styles.errorText}>{errors.mobile}</span>
          )}
        </div>

        <button type="submit" className={styles.proceedButton}>
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default GuestForm;
