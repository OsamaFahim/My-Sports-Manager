import api from './api';

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

export interface ProductCreateData {
  name: string;
  description: string;
  quantity: number;
  price: number;
  productImage: string;
  category: string;
}

export const getProducts = async (filters?: { category?: string; search?: string }): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  
  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : '/products';
  
  const response = await api.get(url);
  return response.data;
};

export const addProduct = async (productData: ProductCreateData): Promise<Product> => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: ProductCreateData): Promise<Product> => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};