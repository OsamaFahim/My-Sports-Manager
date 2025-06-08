import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import OrderStatusService from '../services/orderStatusService';
import { createHttpError } from '../utils/createHttpError';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    
    // Debug logging
    console.log('Order creation request:', {
      userId: orderData.userId,
      isGuestOrder: orderData.isGuestOrder,
      hasGuestUser: !!orderData.guestUser,
      itemsCount: orderData.items?.length
    });

    // Validate required fields
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
      return;
    }

    if (!orderData.paymentInfo) {
      res.status(400).json({
        success: false,
        message: 'Payment information is required'
      });
      return;
    }

    // Validate guest order requirements
    if (orderData.isGuestOrder && !orderData.guestUser) {
      res.status(400).json({
        success: false,
        message: 'Guest user information is required for guest orders'
      });
      return;
    }    // Validate registered user order requirements
    if (!orderData.isGuestOrder && !orderData.userId) {
      // Try to get userId from the JWT token if not provided directly
      const authHeader = req.headers.authorization;
      let userId: string | null = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          userId = decoded.userId;
            // If JWT doesn't have userId but has username, look up the user
          if (!userId && decoded.username) {
            console.log('JWT missing userId, looking up user by username:', decoded.username);
            const user = await User.findOne({ username: decoded.username });
            if (user && user._id) {
              userId = user._id.toString();
              console.log('Found userId from username lookup:', userId);
            }
          }
        } catch (error) {
          console.error('JWT verification failed:', error);
        }
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required for registered user orders'
        });
        return;
      }

      // Set the userId in orderData for processing
      orderData.userId = userId;
    }

    const order = await orderService.createOrder(orderData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        items: order.items,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt
      }
    });  } catch (error: any) {
    console.error('Error in createOrder controller:', error);
    
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating order'
    });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Error in getOrderById controller:', error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching order'
    });
  }
};

// Get order by order number
export const getOrderByOrderNumber = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required'
      });
    }

    const order = await orderService.getOrderByOrderNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Error in getOrderByOrderNumber controller:', error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching order'
    });
  }
};

// Get user orders (for registered users)
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const orders = await orderService.getUserOrders(userId);

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error: any) {
    console.error('Error in getUserOrders controller:', error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user orders'
    });
  }
};

// Get guest orders by email
export const getGuestOrdersByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const orders = await orderService.getGuestOrdersByEmail(email);

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error: any) {
    console.error('Error in getGuestOrdersByEmail controller:', error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching guest orders'
    });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await orderService.updateOrderStatus(orderId, status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Error in updateOrderStatus controller:', error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating order status'
    });
  }
};

// Get all orders (admin functionality)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { orders, total } = await orderService.getAllOrders(page, limit);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error: any) {
    console.error('Error in getAllOrders controller:', error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching orders'
    });
  }
};

// Check orders ready for automated status update
export const getOrdersReadyForUpdate = async (req: Request, res: Response) => {
  try {
    const orderStatusService = OrderStatusService.getInstance();
    const orders = await orderStatusService.getOrdersReadyForUpdate();
    
    res.json({
      success: true,
      message: `Found ${orders.length} orders ready for status update`,
      data: orders
    });
  } catch (error: any) {
    console.error('Error getting orders ready for update:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Manually trigger status update for a specific order (for testing)
export const manuallyUpdateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const orderStatusService = OrderStatusService.getInstance();
    const updatedOrder = await orderStatusService.manuallyUpdateOrderStatus(orderId);
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error: any) {
    console.error('Error manually updating order status:', error);
    res.status(error.message.includes('not found') ? 404 : 400).json({
      success: false,
      message: error.message
    });
  }
};

// Force update all eligible orders (for testing)
export const forceUpdateAllOrders = async (req: Request, res: Response) => {
  try {
    const orderStatusService = OrderStatusService.getInstance();
    await orderStatusService.forceUpdateAllOrders();
    
    res.json({
      success: true,
      message: 'Forced update of all eligible orders completed'
    });
  } catch (error: any) {
    console.error('Error forcing update of all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Automated status management (for testing and monitoring)
export const automatedStatusManagement = async (req: Request, res: Response) => {
  try {
    const orderStatusService = OrderStatusService.getInstance();
    await orderStatusService.forceUpdateAllOrders();

    res.status(200).json({
      success: true,
      message: 'Automated status management executed successfully'
    });
  } catch (error: any) {
    console.error('Error in automatedStatusManagement controller:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while executing automated status management'
    });
  }
};
