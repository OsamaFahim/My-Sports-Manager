import Order, { IOrder } from '../models/Order';
import Product from '../models/Product';
import { createHttpError } from '../utils/createHttpError';

export interface CreateOrderData {
  // User information
  userId?: string;
  guestUser?: {
    email: string;
    mobile: string;
    firstName: string;
    lastName: string;
  };
  isGuestOrder: boolean;
  
  // Order items
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  
  // Payment information
  paymentInfo: {
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
  };
}

export const createOrder = async (orderData: CreateOrderData): Promise<IOrder> => {
  try {
    // Validate and fetch product details
    const orderItems = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      const product = await Product.findById(item.productId);      if (!product) {
        throw createHttpError(`Product with ID ${item.productId} not found`, 404);
      }      if (product.quantity < item.quantity) {
        throw createHttpError(`Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`, 400);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.productImage,
        price: product.price,
        quantity: item.quantity,
        category: product.category,
        seller: product.username
      });
    }

    // Calculate totals
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // Create order
    const order = new Order({
      userId: orderData.userId || undefined,
      guestUser: orderData.guestUser || undefined,
      isGuestOrder: orderData.isGuestOrder,
      items: orderItems,
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),      paymentInfo: orderData.paymentInfo,
      paymentStatus: 'completed', // Since we're simulating payment success
      orderStatus: 'pending'
    });

    const savedOrder = await order.save();

    // Update product quantities
    for (const item of orderData.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }

    return savedOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  try {
    const order = await Order.findById(orderId).populate('items.productId');
    return order;  } catch (error) {
    console.error('Error fetching order:', error);
    throw createHttpError('Error fetching order', 500);
  }
};

export const getOrderByOrderNumber = async (orderNumber: string): Promise<IOrder | null> => {
  try {
    const order = await Order.findOne({ orderNumber }).populate('items.productId');
    return order;
  } catch (error) {    console.error('Error fetching order by order number:', error);
    throw createHttpError('Error fetching order', 500);
  }
};

export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  try {
    const orders = await Order.find({ userId, isGuestOrder: false })
      .sort({ createdAt: -1 })
      .populate('items.productId');
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw createHttpError('Error fetching user orders', 500);
  }
};

export const getGuestOrdersByEmail = async (email: string): Promise<IOrder[]> => {
  try {
    const orders = await Order.find({ 
      'guestUser.email': email, 
      isGuestOrder: true 
    })
      .sort({ createdAt: -1 })
      .populate('items.productId');
    return orders;
  } catch (error) {
    console.error('Error fetching guest orders:', error);
    throw createHttpError('Error fetching guest orders', 500);
  }
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<IOrder | null> => {
  try {    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw createHttpError('Invalid order status', 400);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );    if (!order) {
      throw createHttpError('Order not found', 404);
    }

    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getAllOrders = async (page: number = 1, limit: number = 10): Promise<{ orders: IOrder[], total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.productId');

    const total = await Order.countDocuments();

    return { orders, total };  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw createHttpError('Error fetching orders', 500);
  }
};
