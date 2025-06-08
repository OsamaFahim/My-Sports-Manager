import React from 'react';
import { CartItem } from '../../contexts/CartContext';
import styles from './checkout.module.css';

interface OrderSummaryProps {
  cartItems: CartItem[];
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, total }) => {
  const subtotal = total;
  const shipping = total > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const finalTotal = subtotal + shipping + tax;

  return (
    <div className={styles.orderSummary}>
      <h3 className={styles.summaryTitle}>Order Summary</h3>
      
      <div className={styles.orderItems}>
        {cartItems.map((item) => (
          <div key={item.product._id} className={styles.orderItem}>            <img 
              src={item.product.productImage} 
              alt={item.product.name}
              className={styles.orderItemImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/60x60?text=No+Image';
              }}
            />
            <div className={styles.orderItemDetails}>
              <h4 className={styles.orderItemName}>{item.product.name}</h4>
              <p className={styles.orderItemCategory}>{item.product.category}</p>
              <div className={styles.orderItemPricing}>
                <span className={styles.orderItemQuantity}>Qty: {item.quantity}</span>
                <span className={styles.orderItemPrice}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summaryBreakdown}>
        <div className={styles.summaryLine}>
          <span>Subtotal ({cartItems.length} items):</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className={styles.summaryLine}>
          <span>Shipping:</span>
          <span>
            {shipping === 0 ? (
              <span className={styles.freeShipping}>FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className={styles.summaryLine}>
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className={styles.summaryLine + ' ' + styles.totalLine}>
          <span><strong>Total:</strong></span>
          <span><strong>${finalTotal.toFixed(2)}</strong></span>
        </div>
      </div>

      {shipping === 0 && (
        <div className={styles.freeShippingNotice}>
          🚚 You qualify for FREE shipping!
        </div>
      )}

      {shipping > 0 && (
        <div className={styles.shippingNotice}>
          💡 Add ${(100 - subtotal).toFixed(2)} more for FREE shipping
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
