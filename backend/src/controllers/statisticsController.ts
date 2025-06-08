import { Request, Response } from 'express';
import Order from '../models/Order';
import { createHttpError } from '../utils/createHttpError';

// Get financial statistics with date filtering
export const getFinancialStatistics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, period = 'all' } = req.query;

    // Build date filter
    let dateFilter: any = {};
    
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(new Date(endDate as string).setHours(23, 59, 59, 999))
      };
    } else if (period !== 'all') {
      const now = new Date();
      const startOfPeriod = new Date();
      
      switch (period) {
        case 'today':
          startOfPeriod.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startOfPeriod.setDate(now.getDate() - 7);
          break;
        case 'month':
          startOfPeriod.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startOfPeriod.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      dateFilter.createdAt = { $gte: startOfPeriod };
    }

    // Get orders with completed payment status (excluding cancelled orders)
    const orders = await Order.find({
      ...dateFilter,
      paymentStatus: 'completed',
      orderStatus: { $ne: 'cancelled' }
    }).sort({ createdAt: -1 });

    // Calculate statistics
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Group sales by date
    const salesByDate = orders.reduce((acc: any, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          orders: 0,
          revenue: 0,
          items: 0
        };
      }
      acc[date].orders += 1;
      acc[date].revenue += order.total;
      acc[date].items += order.items.reduce((sum, item) => sum + item.quantity, 0);
      return acc;
    }, {});

    // Top selling products
    const productSales = orders.reduce((acc: any, order) => {
      order.items.forEach(item => {
        const key = item.productId.toString();
        if (!acc[key]) {
          acc[key] = {
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            category: item.category,
            seller: item.seller,
            quantitySold: 0,
            totalRevenue: 0,
            averagePrice: 0
          };
        }
        acc[key].quantitySold += item.quantity;
        acc[key].totalRevenue += item.price * item.quantity;
        acc[key].averagePrice = acc[key].totalRevenue / acc[key].quantitySold;
      });
      return acc;
    }, {});

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Format detailed orders for display
    const detailedOrders = orders.map(order => ({
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      customerEmail: order.isGuestOrder ? order.guestUser?.email : 'Registered User',
      customerName: order.isGuestOrder 
        ? `${order.guestUser?.firstName} ${order.guestUser?.lastName}`
        : 'Registered User',
      isGuestOrder: order.isGuestOrder,
      items: order.items.map(item => ({
        productName: item.productName,
        productImage: item.productImage,
        category: item.category,
        seller: item.seller,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      orderStatus: order.orderStatus
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalSales: Number(totalSales.toFixed(2)),
          totalOrders,
          totalItems,
          averageOrderValue: totalOrders > 0 ? Number((totalSales / totalOrders).toFixed(2)) : 0,
          period: period as string,
          dateRange: {
            start: startDate || null,
            end: endDate || null
          }
        },
        salesByDate: Object.values(salesByDate).sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        topProducts,
        detailedOrders
      }
    });

  } catch (error: any) {
    console.error('Error in getFinancialStatistics controller:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching financial statistics'
    });
  }
};

// Get sales summary for dashboard
export const getSalesSummary = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todaySales, weekSales, monthSales, totalSales] = await Promise.all([
      // Today's sales
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            paymentStatus: 'completed',
            orderStatus: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: { $sum: 1 }
          }
        }
      ]),
      
      // This week's sales
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfWeek },
            paymentStatus: 'completed',
            orderStatus: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: { $sum: 1 }
          }
        }
      ]),
      
      // This month's sales
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            paymentStatus: 'completed',
            orderStatus: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Total sales
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'completed',
            orderStatus: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: {
          revenue: todaySales[0]?.total || 0,
          orders: todaySales[0]?.count || 0
        },
        week: {
          revenue: weekSales[0]?.total || 0,
          orders: weekSales[0]?.count || 0
        },
        month: {
          revenue: monthSales[0]?.total || 0,
          orders: monthSales[0]?.count || 0
        },
        total: {
          revenue: totalSales[0]?.total || 0,
          orders: totalSales[0]?.count || 0
        }
      }
    });

  } catch (error: any) {
    console.error('Error in getSalesSummary controller:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching sales summary'
    });
  }
};
