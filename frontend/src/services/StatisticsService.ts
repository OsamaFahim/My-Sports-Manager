import api from './api';

export interface FinancialStatistics {
  summary: {
    totalSales: number;
    totalOrders: number;
    totalItems: number;
    averageOrderValue: number;
    period: string;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
  salesByDate: Array<{
    date: string;
    orders: number;
    revenue: number;
    items: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    productImage: string;
    category: string;
    seller: string;
    quantitySold: number;
    totalRevenue: number;
    averagePrice: number;
  }>;
  detailedOrders: Array<{
    orderNumber: string;
    createdAt: string;
    customerEmail: string;
    customerName: string;
    isGuestOrder: boolean;
    items: Array<{
      productName: string;
      productImage: string;
      category: string;
      seller: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    orderStatus: string;
  }>;
}

export interface SalesSummary {
  today: {
    revenue: number;
    orders: number;
  };
  week: {
    revenue: number;
    orders: number;
  };
  month: {
    revenue: number;
    orders: number;
  };
  total: {
    revenue: number;
    orders: number;
  };
}

export interface StatisticsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'all' | 'today' | 'week' | 'month' | 'year';
}

class StatisticsService {
  // Get financial statistics with optional filters
  async getFinancialStatistics(filters: StatisticsFilters = {}): Promise<FinancialStatistics> {
    try {
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.period) params.append('period', filters.period);

      const response = await api.get(`/statistics/financial?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching financial statistics:', error);
      throw error;
    }
  }

  // Get sales summary for dashboard
  async getSalesSummary(): Promise<SalesSummary> {
    try {
      const response = await api.get('/statistics/sales-summary');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sales summary:', error);
      throw error;
    }
  }
}

export default new StatisticsService();
