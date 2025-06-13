import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, TicketProduct } from '../../contexts/CartContext';
import styles from './cart.module.css';

const TICKET_ICON = "https://img.icons8.com/ios-filled/50/00e676/ticket.png"; // Green ticket icon

const FloatingCart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Cart Toggle Button - Always visible */}
      <div 
        className={styles.cartButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        🛒
        {getTotalItems() > 0 && (
          <div className={styles.cartBadge}>{getTotalItems()}</div>
        )}
      </div>

      {/* Cart Panel */}
      {isOpen && (
        <div className={styles.cartPanel}>
          <div className={styles.cartHeader}>
            <h3 className={styles.cartTitle}>🛒 Shopping Cart</h3>
          </div>
          <div className={styles.cartContent}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <div className={styles.emptyCartIcon}>🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.product._id + '-' + item.product.category} className={styles.cartItem}>
                    <div className={styles.cartItemImageWrapper}>
                      {item.product.category === 'ticket' ? (
                        <img
                          src={TICKET_ICON}
                          alt="Ticket"
                          className={styles.cartItemImage}
                          style={{ background: '#222', borderRadius: 8 }}
                        />
                      ) : (
                        <img
                          src={item.product.productImage}
                          alt={item.product.name}
                          className={styles.cartItemImage}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                          }}
                        />
                      )}
                    </div>
                    <div className={styles.cartItemInfo}>
                      <h4 className={styles.cartItemName}>{item.product.name}</h4>
                      <div className={styles.cartItemPrice} style={{ color: '#00e676', fontWeight: 600 }}>
                        ${item.product.price.toFixed(2)}
                      </div>
                      {item.product.category === 'ticket' ? (
                        <div className={styles.cartItemDetailsLines}>
                          <div className={styles.cartItemDetailLine} style={{ color: '#fff' }}>
                            {(item.product as TicketProduct).ground}
                          </div>
                          <div className={styles.cartItemDetailLine} style={{ color: '#fff' }}>
                            {(item.product as TicketProduct).date}
                          </div>
                          <div className={styles.cartItemDetailLine} style={{ color: '#fff' }}>
                            {(item.product as TicketProduct).time}
                          </div>
                        </div>
                      ) : (
                        <div className={styles.cartItemDetailLine} style={{ color: '#fff' }}>
                          {item.product.description}
                        </div>
                      )}
                    </div>
                    <div className={styles.cartItemControls}>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          disabled={
                            item.product.category !== 'ticket' &&
                            item.quantity >= (item.product as any).quantity
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <div className={styles.totalItems}>
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </div>
                <div className={styles.totalPrice} style={{ color: '#00e676', fontWeight: 600 }}>
                  ${getTotalPrice().toFixed(2)}
                </div>
              </div>

              <div className={styles.cartActions}>
                <button 
                  className={styles.clearButton}
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <button 
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingCart;