import * as cron from 'node-cron';
import Order, { IOrder } from '../models/Order';

export class OrderStatusService {
  private static instance: OrderStatusService;
  private cronJob: cron.ScheduledTask | null = null;

  private constructor() {}

  public static getInstance(): OrderStatusService {
    if (!OrderStatusService.instance) {
      OrderStatusService.instance = new OrderStatusService();
    }
    return OrderStatusService.instance;
  }

  /**
   * Start the automated order status progression
   * Runs every hour to check and update order statuses
   */
  public startAutomatedStatusProgression(): void {
    if (this.cronJob) {
      console.log('Order status progression is already running');
      return;
    }

    // Run every hour to check for status updates
    this.cronJob = cron.schedule('0 * * * *', async () => {
      try {
        await this.processOrderStatusUpdates();
      } catch (error) {
        console.error('Error in automated order status progression:', error);
      }
    });

    console.log('✅ Automated order status progression started - runs every hour');
    
    // Also run once immediately on startup
    this.processOrderStatusUpdates().catch(error => {
      console.error('Error in initial order status check:', error);
    });
  }

  /**
   * Stop the automated order status progression
   */
  public stopAutomatedStatusProgression(): void {
    if (this.cronJob) {
      this.cronJob.destroy();
      this.cronJob = null;
      console.log('Automated order status progression stopped');
    }
  }

  /**
   * Process all orders and update their statuses based on time elapsed
   */
  private async processOrderStatusUpdates(): Promise<void> {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      console.log('🔄 Checking orders for status updates...');

      // Find orders that are not cancelled or delivered and need status updates
      const orders = await Order.find({
        orderStatus: { $in: ['pending', 'confirmed', 'processing', 'shipped'] },
        updatedAt: { $lte: oneDayAgo }
      }).sort({ updatedAt: 1 });

      let updatedCount = 0;

      for (const order of orders) {
        const newStatus = this.getNextStatus(order.orderStatus);
        if (newStatus) {
          await Order.findByIdAndUpdate(
            order._id,
            { 
              orderStatus: newStatus,
              updatedAt: new Date()
            },
            { new: true }
          );
          
          console.log(`📦 Order ${order.orderNumber}: ${order.orderStatus} → ${newStatus}`);
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        console.log(`✅ Updated ${updatedCount} order(s) status`);
      } else {
        console.log('ℹ️  No orders required status updates');
      }

    } catch (error) {
      console.error('Error processing order status updates:', error);
      throw error;
    }
  }

  /**
   * Get the next status in the progression chain
   */
  private getNextStatus(currentStatus: string): string | null {
    const statusProgression: { [key: string]: string } = {
      'pending': 'confirmed',
      'confirmed': 'processing',
      'processing': 'shipped',
      'shipped': 'delivered'
    };

    return statusProgression[currentStatus] || null;
  }

  /**
   * Manually trigger status update for a specific order (for testing)
   */
  public async manuallyUpdateOrderStatus(orderId: string): Promise<IOrder | null> {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const newStatus = this.getNextStatus(order.orderStatus);
      if (!newStatus) {
        throw new Error(`Cannot progress from status: ${order.orderStatus}`);
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { 
          orderStatus: newStatus,
          updatedAt: new Date()
        },
        { new: true }
      );

      console.log(`📦 Manual update - Order ${order.orderNumber}: ${order.orderStatus} → ${newStatus}`);
      return updatedOrder;

    } catch (error) {
      console.error('Error manually updating order status:', error);
      throw error;
    }
  }

  /**
   * Get orders that are ready for status update (for testing/monitoring)
   */
  public async getOrdersReadyForUpdate(): Promise<IOrder[]> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return await Order.find({
      orderStatus: { $in: ['pending', 'confirmed', 'processing', 'shipped'] },
      updatedAt: { $lte: oneDayAgo }
    }).sort({ updatedAt: 1 });
  }

  /**
   * Force update all eligible orders immediately (for testing)
   */
  public async forceUpdateAllOrders(): Promise<number> {
    await this.processOrderStatusUpdates();
    return 0; // Return count would require refactoring, but this will trigger the update
  }
}

export default OrderStatusService;
