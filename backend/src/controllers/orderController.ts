import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import OrderStatusService from '../services/orderStatusService';

// Create a new order (handles tickets as well)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
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
    });
  } catch (error: any) {
    console.error('Error in createOrder controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while creating order'
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    console.error('Error in getOrderById controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderByOrderNumber = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const order = await orderService.getOrderByOrderNumber(orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    console.error('Error in getOrderByOrderNumber controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json({ success: true, data: orders, count: orders.length });
  } catch (error: any) {
    console.error('Error in getUserOrders controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGuestOrdersByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const orders = await orderService.getGuestOrdersByEmail(email);
    res.status(200).json({ success: true, data: orders, count: orders.length });
  } catch (error: any) {
    console.error('Error in getGuestOrdersByEmail controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(orderId, status);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Error in updateOrderStatus controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// Automated status management and other admin endpoints remain unchanged
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