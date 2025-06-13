import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from './ProductContext';

// Extend Product type for ticket support
export interface TicketProduct extends Product {
  category: 'ticket';
  ground: string;
  date: string;
  time: string;
  // No image for tickets
}

export interface CartItem {
  product: Product | TicketProduct;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product | TicketProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product | TicketProduct, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item =>
          item.product._id === product._id &&
          item.product.category === product.category
      );
      if (existingItemIndex !== -1) {
        const updated = [...prevItems];
        updated[existingItemIndex].quantity = updated[existingItemIndex].quantity + (quantity || 1);
        return updated;
      }
      return [...prevItems, { product, quantity: quantity || 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.product._id === productId) {
          // For tickets, allow any positive quantity
          if (item.product.category === 'ticket') {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          // For products, clamp to available stock
          return { ...item, quantity: Math.max(1, Math.min(quantity, (item.product as Product).quantity)) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.product._id === productId);
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getCartItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};