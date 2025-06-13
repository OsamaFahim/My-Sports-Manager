import React from 'react';
import { CartItem, TicketProduct } from '../../contexts/CartContext';
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
          <div
            key={item.product._id + (item.product.category === 'ticket' ? Math.random() : '')}
            style={{
              background: "#222",
              borderRadius: "8px",
              padding: "14px",
              marginBottom: "12px",
              color: "#fff"
            }}
          >
            {item.product.category === 'ticket' ? (
              <div>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#fff" }}>
                  {item.product.name}
                </div>
                <div style={{ margin: "8px 0 0 0", color: "#fff" }}>🎟️ Ticket</div>
                <div style={{ margin: "8px 0 0 0", color: "#fff" }}>
                  <div>🏟️ Ground: {(item.product as TicketProduct).ground}</div>
                  <div>📅 Date: {(item.product as TicketProduct).date}</div>
                  <div>⏰ Time: {(item.product as TicketProduct).time}</div>
                </div>
                <div style={{ marginTop: "8px", fontWeight: "bold", color: "#fff" }}>
                  Qty: {item.quantity}
                </div>
                <div style={{ fontWeight: "bold", color: "#fff" }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img 
                  src={item.product.productImage} 
                  alt={item.product.name}
                  className={styles.orderItemImage}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, marginRight: 12 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                  }}
                />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#fff" }}>
                    {item.product.name}
                  </div>
                  <div style={{ color: "#fff" }}>{item.product.category}</div>
                  <div style={{ marginTop: "8px", fontWeight: "bold", color: "#fff" }}>
                    Qty: {item.quantity}
                  </div>
                  <div style={{ fontWeight: "bold", color: "#fff" }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
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