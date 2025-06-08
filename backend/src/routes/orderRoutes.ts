import express from 'express';
import * as orderController from '../controllers/orderController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = express.Router();

// Helper to wrap async controllers and forward errors
function wrap(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
}

// Create a new order (both guest and registered users)
router.post('/', wrap(orderController.createOrder));

// Get order by ID
router.get('/:orderId', wrap(orderController.getOrderById));

// Get order by order number
router.get('/number/:orderNumber', wrap(orderController.getOrderByOrderNumber));

// Get user orders (protected route for registered users)
router.get('/user/:userId', authenticateJWT, wrap(orderController.getUserOrders));

// Get guest orders by email (no authentication required)
router.get('/guest/:email', wrap(orderController.getGuestOrdersByEmail));

// Update order status (protected route - admin only)
router.put('/:orderId/status', authenticateJWT, wrap(orderController.updateOrderStatus));

// Manually update order status (for testing - admin only)
router.post('/:orderId/manual-update', authenticateJWT, wrap(orderController.manuallyUpdateOrderStatus));

// Get orders ready for status update (admin only)
router.get('/admin/ready-for-update', authenticateJWT, wrap(orderController.getOrdersReadyForUpdate));

// Force update all eligible orders (admin only - for testing)
router.post('/admin/force-update', authenticateJWT, wrap(orderController.forceUpdateAllOrders));

// Get all orders (protected route - admin only)
router.get('/', authenticateJWT, wrap(orderController.getAllOrders));

export default router;
