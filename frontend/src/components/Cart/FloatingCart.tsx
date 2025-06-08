import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import styles from './cart.module.css';

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
    <>      {/* Cart Toggle Button - Always visible */}
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
          </div>          <div className={styles.cartContent}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <div className={styles.emptyCartIcon}>🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>                {cartItems.map((item) => (
                  <div key={item.product._id} className={styles.cartItem}>
                    <img
                      src={item.product.productImage}
                      alt={item.product.name}
                      className={styles.cartItemImage}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                      }}
                    />
                    
                    <div className={styles.cartItemInfo}>
                      <h4 className={styles.cartItemName}>{item.product.name}</h4>
                      <p className={styles.cartItemPrice}>${item.product.price.toFixed(2)}</p>
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
                          disabled={item.quantity >= item.product.quantity}
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
          </div>          {cartItems.length > 0 && (
            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <div className={styles.totalItems}>
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </div>
                <div className={styles.totalPrice}>
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
