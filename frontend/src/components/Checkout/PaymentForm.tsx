import React, { useState } from 'react';
import { CartItem } from '../../contexts/CartContext';
import styles from './checkout.module.css';

interface CustomerDetails {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

interface PaymentData {
  cardholderName: string;
  cardType: string;
  lastFourDigits: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface PaymentFormProps {
  customerDetails: CustomerDetails;
  cartItems: CartItem[];
  total: number;
  onSuccess: (paymentData: PaymentData) => void;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  customerDetails,
  cartItems,
  total,
  onSuccess,
  isProcessing
}) => {  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: customerDetails.firstName && customerDetails.lastName 
      ? `${customerDetails.firstName} ${customerDetails.lastName}`
      : customerDetails.username || '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  const validatePaymentForm = () => {
    const newErrors: ValidationErrors = {};

    // Card number validation
    const cardNum = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNum) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNum.length < 13 || cardNum.length > 19) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry date validation
    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      const now = new Date();
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry <= now) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    // Cardholder name validation
    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    // Billing address validation
    if (!paymentData.billingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!paymentData.billingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!paymentData.billingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!paymentData.billingAddress.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setPaymentData(prev => ({
        ...prev,
        [name]: formatCardNumber(value)
      }));
    } else if (name === 'expiryDate') {
      setPaymentData(prev => ({
        ...prev,
        [name]: formatExpiryDate(value)
      }));
    } else if (name === 'cvv') {
      setPaymentData(prev => ({
        ...prev,
        [name]: value.replace(/[^0-9]/g, '').substring(0, 4)
      }));
    } else if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: ValidationErrors) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) {
      return;
    }

    // Here you would integrate with a real payment gateway like Stripe, PayPal, etc.
    // For demo purposes, we'll simulate the payment process
    try {
      // Simulate API call to payment processor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prepare payment data for order creation
      const cardType = getCardType(paymentData.cardNumber);
      const lastFour = paymentData.cardNumber.replace(/\s/g, '').slice(-4);
      
      const paymentResult: PaymentData = {
        cardholderName: paymentData.cardholderName,
        cardType,
        lastFourDigits: lastFour,
        billingAddress: paymentData.billingAddress
      };
      
      onSuccess(paymentResult);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const getCardType = (cardNumber: string) => {
    const num = cardNumber.replace(/\s/g, '');
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num)) return 'American Express';
    if (/^6/.test(num)) return 'Discover';
    return 'Unknown';
  };

  return (
    <div className={styles.paymentForm}>      <div className={styles.securityBadge}>
        <span className={styles.securityIcon}>🔒</span>
        <span>Secure Payment Gateway</span>
      </div>

      <div className={styles.orderSummarySection}>
        <h3 className={styles.sectionTitle}>Order Summary</h3>
        <div className={styles.itemsList}>
          {cartItems.map((item, index) => (
            <div key={index} className={styles.orderItem}>
              <span className={styles.itemName}>
                {item.product.name} x {item.quantity}
              </span>
              <span className={styles.itemPrice}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <h2 className={styles.paymentTitle}>Payment Information</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.cardSection}>
          <h3 className={styles.sectionTitle}>Card Details</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber" className={styles.label}>
              Card Number *
            </label>
            <div className={styles.cardInputWrapper}>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.cardNumber ? styles.error : ''}`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <span className={styles.cardType}>
                {getCardType(paymentData.cardNumber)}
              </span>
            </div>
            {errors.cardNumber && (
              <span className={styles.errorText}>{errors.cardNumber}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="expiryDate" className={styles.label}>
                Expiry Date *
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.expiryDate ? styles.error : ''}`}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiryDate && (
                <span className={styles.errorText}>{errors.expiryDate}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cvv" className={styles.label}>
                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.cvv ? styles.error : ''}`}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && (
                <span className={styles.errorText}>{errors.cvv}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cardholderName" className={styles.label}>
              Cardholder Name *
            </label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              value={paymentData.cardholderName}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.cardholderName ? styles.error : ''}`}
              placeholder="John Doe"
            />
            {errors.cardholderName && (
              <span className={styles.errorText}>{errors.cardholderName}</span>
            )}
          </div>
        </div>

        <div className={styles.billingSection}>
          <h3 className={styles.sectionTitle}>Billing Address</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="billing.street" className={styles.label}>
              Street Address *
            </label>
            <input
              type="text"
              id="billing.street"
              name="billing.street"
              value={paymentData.billingAddress.street}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.street ? styles.error : ''}`}
              placeholder="123 Main Street"
            />
            {errors.street && (
              <span className={styles.errorText}>{errors.street}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="billing.city" className={styles.label}>
                City *
              </label>
              <input
                type="text"
                id="billing.city"
                name="billing.city"
                value={paymentData.billingAddress.city}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.city ? styles.error : ''}`}
                placeholder="New York"
              />
              {errors.city && (
                <span className={styles.errorText}>{errors.city}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="billing.state" className={styles.label}>
                State *
              </label>
              <input
                type="text"
                id="billing.state"
                name="billing.state"
                value={paymentData.billingAddress.state}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.state ? styles.error : ''}`}
                placeholder="NY"
              />
              {errors.state && (
                <span className={styles.errorText}>{errors.state}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="billing.zipCode" className={styles.label}>
                ZIP Code *
              </label>
              <input
                type="text"
                id="billing.zipCode"
                name="billing.zipCode"
                value={paymentData.billingAddress.zipCode}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.zipCode ? styles.error : ''}`}
                placeholder="10001"
              />
              {errors.zipCode && (
                <span className={styles.errorText}>{errors.zipCode}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.paymentActions}>
          <div className={styles.totalAmount}>
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <button 
            type="submit" 
            className={styles.payButton}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className={styles.processing}>
                <span className={styles.spinner}></span>
                Processing Payment...
              </span>
            ) : (
              `Pay $${total.toFixed(2)}`
            )}
          </button>
        </div>
      </form>

      <div className={styles.securityInfo}>
        <p>🔐 Your payment information is encrypted and secure</p>
        <p>💳 We accept all major credit cards</p>
      </div>
    </div>
  );
};

export default PaymentForm;
