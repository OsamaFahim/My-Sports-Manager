// filepath: d:\WebProgramming\Sportify\My-Sports-Manager\frontend\src\services\OrderService.ts
import api from './api';

// Order interfaces
export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface GuestUser {
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardholderName: string;
  cardType: string;
  lastFourDigits: string;
  billingAddress: BillingAddress;
}

export interface CreateOrderData {
  userId?: string;
  guestUser?: GuestUser;
  isGuestOrder: boolean;
  items: OrderItem[];
  paymentInfo: PaymentInfo;
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  category: string;
  seller: string;
}

export interface FullOrderResponse {
  success: boolean;
  message?: string;
  data: {
    _id: string;
    orderNumber: string;
    userId?: string;
    guestUser?: GuestUser;
    isGuestOrder: boolean;
    items: OrderItemResponse[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    paymentInfo: PaymentInfo;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrderListResponse {
  success: boolean;
  message?: string;
  data: FullOrderResponse['data'][];
  count?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data?: {
    orderId: string;
    orderNumber: string;
    total: number;
    items: OrderItemResponse[];
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  };
}

class OrderService {  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
    try {
      const response = await api.post('/orders', orderData);
      return response.data as OrderResponse;
    } catch (error) {
      console.error('Error creating order:', error);
      const errorResponse = error as { response?: { data?: ErrorResponse } };
      throw errorResponse.response?.data || { success: false, message: 'Failed to create order' };
    }
  }
  // Get order by ID
  async getOrderById(orderId: string): Promise<FullOrderResponse> {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data as FullOrderResponse;
    } catch (error) {
      console.error('Error fetching order:', error);
      const errorResponse = error as { response?: { data?: ErrorResponse } };
      throw errorResponse.response?.data || { success: false, message: 'Failed to fetch order' };
    }
  }

  // Get order by order number
  async getOrderByOrderNumber(orderNumber: string): Promise<FullOrderResponse> {
    try {
      const response = await api.get(`/orders/number/${orderNumber}`);
      return response.data as FullOrderResponse;
    } catch (error) {
      console.error('Error fetching order by order number:', error);
      const errorResponse = error as { response?: { data?: ErrorResponse } };
      throw errorResponse.response?.data || { success: false, message: 'Failed to fetch order' };
    }
  }

  // Get user orders (for registered users)
  async getUserOrders(userId: string): Promise<OrderListResponse> {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data as OrderListResponse;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      const errorResponse = error as { response?: { data?: ErrorResponse } };
      throw errorResponse.response?.data || { success: false, message: 'Failed to fetch user orders' };
    }
  }

  // Get guest orders by email
  async getGuestOrdersByEmail(email: string): Promise<OrderListResponse> {
    try {
      const response = await api.get(`/orders/guest/${email}`);
      return response.data as OrderListResponse;
    } catch (error) {
      console.error('Error fetching guest orders:', error);
      const errorResponse = error as { response?: { data?: ErrorResponse } };
      throw errorResponse.response?.data || { success: false, message: 'Failed to fetch guest orders' };
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<FullOrderResponse> {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data as FullOrderResponse;
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorResponse = error as { response?: { data?: ErrorResponse } };
      throw errorResponse.response?.data || { success: false, message: 'Failed to update order status' };
    }
  }

  // Get all orders (admin functionality)
  async getAllOrders(page: number = 1, limit: number = 10): Promise<OrderListResponse> {
    try {
      const response = await api.get(`/orders?page=${page}&limit=${limit}`);
      return response.data as OrderListResponse;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      const errorResponse = error as { response?: { data?: ErrorResponse } };
      throw errorResponse.response?.data || { success: false, message: 'Failed to fetch orders' };
    }
  }
}

export default new OrderService();
