import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as productService from '../services/ProductService';
import { useAuth } from './AuthContext';

export interface Product {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  productImage: string;
  category: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  selectedCategory: string;
  searchTerm: string;
  addProduct: (data: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    productImage: string;
    category: string;
  }) => Promise<void>;
  updateProduct: (id: string, data: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    productImage: string;
    category: string;
  }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  refreshProducts: () => Promise<void>;
  getProductsByUser: (username: string) => Product[];
  isAuthenticated: boolean;
  username: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, username } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters: { category?: string; search?: string } = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (searchTerm) filters.search = searchTerm;
      
      const fetchedProducts = await productService.getProducts(filters);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (data: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    productImage: string;
    category: string;
  }) => {
    setLoading(true);
    try {
      const newProduct = await productService.addProduct(data);
      setProducts(prev => [newProduct, ...prev]);
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    productImage: string;
    category: string;
  }) => {
    setLoading(true);
    try {
      const updated = await productService.updateProduct(id, data);
      setProducts(prev => prev.map(p => (p._id === id ? updated : p)));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const getProductsByUser = (username: string) => {
    return products.filter(p => p.username === username);
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      selectedCategory,
      searchTerm,
      addProduct,
      updateProduct,
      deleteProduct,
      setSelectedCategory,
      setSearchTerm,
      refreshProducts,
      getProductsByUser,
      isAuthenticated,
      username
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
}
