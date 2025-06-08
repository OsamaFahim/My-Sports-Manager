import React, { useState } from 'react';
import styles from './tracking.module.css';
import OrderService from '../../services/OrderService';
import { useAuth } from '../../contexts/AuthContext';

interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  estimatedDelivery?: string;
  orderStatus: string; // This maps to our status field
}

const TrackingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);  const { isAuthenticated, username } = useAuth();

  // Map backend order status to our frontend status enum
  const mapOrderStatus = (orderStatus: string): Order['status'] => {
    switch (orderStatus.toLowerCase()) {
      case 'pending': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'in-transit': 
      case 'in_transit': return 'in-transit';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);    try {
      const response = await OrderService.getGuestOrdersByEmail(email);
      if (response.success && response.data) {
        // Map the response data to our Order interface
        const mappedOrders: Order[] = response.data.map(order => ({
          ...order,
          status: mapOrderStatus(order.orderStatus)
        }));
        setOrders(mappedOrders);
      } else {
        setOrders([]);
        setError('No orders found for this email address');
      }
    } catch (err: unknown) {
      setOrders([]);
      const errorMessage = 
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (err as { message?: string })?.message ||
        'Failed to fetch orders. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: Order['status']) => {
    const statusMap = {
      pending: { label: 'Order Pending', color: '#ffa726', step: 1 },
      confirmed: { label: 'Order Confirmed', color: '#42a5f5', step: 2 },
      processing: { label: 'Processing', color: '#66bb6a', step: 3 },
      shipped: { label: 'Shipped', color: '#26c6da', step: 4 },
      'in-transit': { label: 'In Transit', color: '#ab47bc', step: 5 },
      delivered: { label: 'Delivered', color: '#00e676', step: 6 },
      cancelled: { label: 'Cancelled', color: '#ef5350', step: 0 }
    };
    return statusMap[status] || statusMap.pending;
  };

  const renderStatusTimeline = (currentStatus: Order['status']) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'in-transit', 'delivered'] as const;
    const currentStep = getStatusInfo(currentStatus).step;
    
    if (currentStatus === 'cancelled') {
      return (
        <div className={styles.statusTimeline}>
          <div className={`${styles.statusStep} ${styles.cancelled}`}>
            <div className={styles.statusDot}></div>
            <span>Order Cancelled</span>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.statusTimeline}>
        {statuses.map((status, index) => {
          const step = index + 1;
          const isCompleted = step <= currentStep;
          const isCurrent = step === currentStep;
          
          return (
            <div 
              key={status}
              className={`${styles.statusStep} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
            >
              <div className={styles.statusDot}>
                {isCompleted && <span>✓</span>}
              </div>
              <span>{getStatusInfo(status).label}</span>
              {index < statuses.length - 1 && (
                <div className={`${styles.statusLine} ${isCompleted ? styles.completedLine : ''}`}></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className={styles.trackingContainer}>
      <div className={styles.wrapper}>
        <div className={styles.trackingHeader}>
          <h1 className={styles.trackingTitle}>Track Your Order</h1>
          <p className={styles.trackingSubtitle}>
            Enter your email address to track your order status and delivery information
          </p>
        </div>

        <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={styles.emailInput}
              required
            />
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </div>
        </form>

        {isAuthenticated && (
          <div className={styles.authUserNotice}>
            <p>
              <strong>Logged in as {username}</strong> - You can also view your orders in your account dashboard
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {hasSearched && !loading && orders.length === 0 && !error && (
        <div className={styles.noOrders}>
          <h3>No Orders Found</h3>
          <p>We couldn't find any orders associated with this email address.</p>
          <p>Please check your email and try again, or contact support if you need assistance.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className={styles.ordersSection}>
          <h2 className={styles.ordersTitle}>Your Orders ({orders.length})</h2>
          
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <h3>Order #{order.orderNumber}</h3>
                  <p className={styles.orderDate}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className={styles.orderTotal}>Total: ${order.total.toFixed(2)}</p>
                </div>
                <div className={styles.currentStatus}>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusInfo(order.status).color }}
                  >
                    {getStatusInfo(order.status).label}
                  </span>
                </div>
              </div>

              <div className={styles.orderProgress}>
                <h4>Order Progress</h4>
                {renderStatusTimeline(order.status)}
              </div>

              <div className={styles.orderDetails}>
                <div className={styles.orderItems}>
                  <h4>Items Ordered</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        <span className={styles.itemName}>{item.productName}</span>
                        <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                        <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.shippingAddress && (
                  <div className={styles.shippingInfo}>
                    <h4>Shipping Address</h4>
                    <p>
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                )}

                {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className={styles.deliveryInfo}>
                    <h4>Estimated Delivery</h4>
                    <p className={styles.deliveryDate}>
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}        </div>
      )}
      </div>
    </div>
  );
};

export default TrackingPage;
