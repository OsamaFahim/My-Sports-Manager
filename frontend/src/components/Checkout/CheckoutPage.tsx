import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm.tsx';
import OrderSummary from './OrderSummary.tsx';
import GuestForm from './GuestForm.tsx';
import OrderService from '../../services/OrderService';
import styles from './checkout.module.css';

interface GuestDetails {
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
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

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, username, userId } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    email: '',
    mobile: '',
    firstName: '',
    lastName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{
    orderNumber: string;
    orderId: string;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems, navigate]);

  const handleGuestDetailsSubmit = (details: GuestDetails) => {
    setGuestDetails(details);
    setStep('payment');
  };

  const handlePaymentSuccess = async (paymentData: PaymentData) => {
    setIsProcessing(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        userId: isAuthenticated && userId ? userId : undefined,
        guestUser: !isAuthenticated ? guestDetails : undefined,
        isGuestOrder: !isAuthenticated,
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          category: item.product.category, // No ternary, just send as is
          price: item.product.price        // Always include price
        })),
        paymentInfo: paymentData
      };

      // Create order via API
      const response = await OrderService.createOrder(orderData);

      if (response.success && response.data) {
        setOrderInfo({
          orderNumber: response.data.orderNumber,
          orderId: response.data.orderId,
          total: response.data.total
        });
        setStep('success');
        clearCart();
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error: unknown) {
      console.error('Order creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process order. Please try again.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToShopping = () => {
    navigate('/shop');
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutHeader}>
        <h1 className={styles.checkoutTitle}>Checkout</h1>
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${step === 'details' ? styles.active : styles.completed}`}>
            1. Details
          </div>
          <div className={`${styles.step} ${step === 'payment' ? styles.active : ''}`}>
            2. Payment
          </div>
          <div className={`${styles.step} ${step === 'success' ? styles.active : ''}`}>
            3. Confirmation
          </div>
        </div>
      </div>
      <div className={styles.checkoutContent}>
        {step === 'details' && !isAuthenticated && (
          <div className={styles.detailsSection}>
            <GuestForm onSubmit={handleGuestDetailsSubmit} />
            <OrderSummary cartItems={cartItems} total={getTotalPrice()} />
          </div>
        )}

        {step === 'details' && isAuthenticated && (
          <div className={styles.detailsSection}>
            <div className={styles.userDetails}>
              <h2>Your Details</h2>
              <p><strong>Username:</strong> {username}</p>
              <button
                className={styles.proceedButton}
                onClick={() => setStep('payment')}
              >
                Proceed to Payment
              </button>
            </div>
            <OrderSummary cartItems={cartItems} total={getTotalPrice()} />
          </div>
        )}

        {step === 'payment' && (
          <div className={styles.paymentSection}>
            <PaymentForm
              customerDetails={isAuthenticated ? { username: username || undefined } : guestDetails}
              cartItems={cartItems}
              total={getTotalPrice()}
              onSuccess={handlePaymentSuccess}
              isProcessing={isProcessing}
            />
            <OrderSummary cartItems={cartItems} total={getTotalPrice()} />
          </div>
        )}
        {step === 'success' && orderInfo && (
          <div className={styles.successSection}>
            <div className={styles.successIcon}>✅</div>
            <h2 className={styles.successTitle}>Order Placed Successfully!</h2>
            <div className={styles.orderDetails}>
              <p><strong>Order Number:</strong> {orderInfo.orderNumber}</p>
              <p><strong>Total Amount:</strong> ${orderInfo.total.toFixed(2)}</p>
            </div>
            <p className={styles.successMessage}>
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
            <button
              className={styles.backToShopButton}
              onClick={handleBackToShopping}
            >
              Continue Shopping
            </button>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => setError('')}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;