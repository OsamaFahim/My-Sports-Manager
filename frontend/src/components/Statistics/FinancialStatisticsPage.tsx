import React, { useState, useEffect, useCallback } from 'react';
import styles from './FinancialStatistics.module.css';
import StatisticsService, { FinancialStatistics, StatisticsFilters } from '../../services/StatisticsService';

const FinancialStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<FinancialStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StatisticsFilters>({
    period: 'all'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StatisticsService.getFinancialStatistics(filters);
      setStatistics(data);
    } catch (err: unknown) {
      console.error('Error fetching statistics:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch financial statistics'
        : 'Failed to fetch financial statistics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);


  const handleFilterChange = (newFilters: Partial<StatisticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePeriodChange = (period: string) => {
    if (period === 'custom') {
      setFilters(prev => ({ ...prev, period: 'all' }));
    } else {
      setFilters(prev => ({ 
        ...prev, 
        period: period as StatisticsFilters['period'],
        startDate: undefined,
        endDate: undefined
      }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.statisticsContainer}>
        <div className={styles.loading}>Loading financial statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statisticsContainer}>
        <div className={styles.error}>
          <h3 className={styles.errorTitle}>Error Loading Statistics</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={fetchStatistics}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className={styles.statisticsContainer}>
        <div className={styles.error}>
          <h3 className={styles.errorTitle}>No Data Available</h3>
          <p className={styles.errorMessage}>No statistics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Financial Statistics & Reports</h1>
          <p className={styles.pageSubtitle}>Detailed financial reports highlighting profit margins and sales breakdown</p>
        </div>        {/* Filters Section */}
        <div className={styles.filtersSection}>
          <h3 className={styles.filtersTitle}>Filter Reports</h3>
          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Time Period</label>
              <select
                className={styles.filterSelect}
                value={filters.period}
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {(filters.period === 'all' && (filters.startDate || filters.endDate)) && (
              <>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                    className={styles.filterSelect}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>End Date</label>
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange({ endDate: e.target.value })}
                    className={styles.filterSelect}
                  />
                </div>
              </>
            )}
          </div>
          {filters.period === 'all' && !filters.startDate && !filters.endDate && (
            <div className={styles.customDateSection}>
              <button
                className={styles.primaryButton}
                onClick={() => handleFilterChange({ 
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0]
                })}
              >
                Set Custom Date Range
              </button>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className={styles.statisticsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Total Sales</h3>
              <div className={styles.statIcon}>💰</div>
            </div>
            <div className={styles.statValue}>
              {formatCurrency(statistics.summary.totalSales)}
            </div>
            <p className={styles.statDescription}>Revenue from all orders</p>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Total Orders</h3>
              <div className={styles.statIcon}>📦</div>
            </div>
            <div className={styles.statValue}>
              {statistics.summary.totalOrders}
            </div>
            <p className={styles.statDescription}>Number of orders placed</p>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Items Sold</h3>
              <div className={styles.statIcon}>📊</div>
            </div>
            <div className={styles.statValue}>
              {statistics.summary.totalItems}
            </div>
            <p className={styles.statDescription}>Total items purchased</p>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3 className={styles.statTitle}>Avg Order Value</h3>
              <div className={styles.statIcon}>💲</div>
            </div>
            <div className={styles.statValue}>
              {formatCurrency(statistics.summary.averageOrderValue)}
            </div>
            <p className={styles.statDescription}>Average order value</p>
          </div>
        </div>        {/* Tab Navigation */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsWrapper}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'products', label: 'Top Products' },
              { key: 'orders', label: 'Detailed Orders' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'overview' | 'products' | 'orders')}
                className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className={styles.tableContainer}>
            <h3 className={styles.sectionTitle}>Sales by Date</h3>
            {statistics.salesByDate.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Orders</th>
                      <th>Items</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.salesByDate.map((day) => (
                      <tr key={day.date}>
                        <td>{formatDate(day.date)}</td>
                        <td>{day.orders}</td>
                        <td>{day.items}</td>
                        <td>{formatCurrency(day.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.noDataMessage}>No sales data available for the selected period.</p>
            )}
          </div>
        )}        {activeTab === 'products' && (
          <div className={styles.tableContainer}>
            <h3 className={styles.sectionTitle}>Top Selling Products</h3>
            {statistics.topProducts.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Seller</th>
                      <th>Qty Sold</th>
                      <th>Revenue</th>
                      <th>Avg Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.topProducts.map((product) => (
                      <tr key={product.productId}>
                        <td>
                          <div className={styles.productCell}>
                            <img 
                              src={product.productImage} 
                              alt={product.productName}
                              className={styles.productImage}
                            />
                            <span>{product.productName}</span>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td>{product.seller}</td>
                        <td>{product.quantitySold}</td>
                        <td>{formatCurrency(product.totalRevenue)}</td>
                        <td>{formatCurrency(product.averagePrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.noDataMessage}>No product sales data available for the selected period.</p>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.tableContainer}>
            <h3 className={styles.sectionTitle}>Detailed Orders ({statistics.detailedOrders.length} orders)</h3>
            {statistics.detailedOrders.length > 0 ? (
              <div className={styles.ordersGrid}>
                {statistics.detailedOrders.map((order) => (
                  <div key={order.orderNumber} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderInfo}>
                        <h4 className={styles.orderNumber}>Order #{order.orderNumber}</h4>
                        <p className={styles.orderDate}>
                          {formatDate(order.createdAt)} | Status: {order.orderStatus}
                        </p>
                        <p className={styles.customerInfo}>
                          Customer: {order.customerName} ({order.customerEmail})
                          {order.isGuestOrder && <span className={styles.guestBadge}>Guest Order</span>}
                        </p>
                      </div>
                      <div className={styles.orderSummary}>
                        <p className={styles.orderTotal}>{formatCurrency(order.total)}</p>
                        <p className={styles.itemCount}>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className={styles.orderItems}>
                      <h5 className={styles.itemsTitle}>Items:</h5>
                      {order.items.map((item, index) => (
                        <div key={index} className={styles.orderItem}>
                          <div className={styles.itemInfo}>
                            <img 
                              src={item.productImage} 
                              alt={item.productName}
                              className={styles.itemImage}
                            />
                            <div className={styles.itemDetails}>
                              <p className={styles.itemName}>{item.productName}</p>
                              <p className={styles.itemMeta}>{item.category} | {item.seller}</p>
                            </div>
                          </div>
                          <div className={styles.itemPricing}>
                            <p className={styles.itemQuantityPrice}>
                              {item.quantity} × {formatCurrency(item.price)}
                            </p>
                            <p className={styles.itemSubtotal}>= {formatCurrency(item.subtotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderTotals}>
                      <div className={styles.totalsBreakdown}>
                        <p>Subtotal: {formatCurrency(order.subtotal)}</p>
                        <p>Shipping: {formatCurrency(order.shipping)}</p>
                        <p>Tax: {formatCurrency(order.tax)}</p>
                        <p className={styles.finalTotal}>Total: {formatCurrency(order.total)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noDataMessage}>No orders found for the selected period.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialStatisticsPage;
