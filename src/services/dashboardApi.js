// src/services/dashboardApi.js
import apiClient from './apiClient';

/**
 * Dashboard API - Uses existing endpoints to aggregate dashboard statistics
 * Note: Backend doesn't have dedicated /api/dashboard endpoint yet
 * This service aggregates data from multiple endpoints
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics by calling multiple APIs
   * This is a client-side aggregation solution
   */
  async getDashboardStats() {
    try {
      // Call all APIs in parallel
      const [usersRes, sellersRes, productsRes, registrationsRes] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/seller'),
        apiClient.get('/product'),
        apiClient.get('/sellerregistration'),
      ]);

      // Extract data from responses
      const users = usersRes.data || [];
      const sellers = sellersRes.data || [];
      const products = productsRes.data || [];
      const registrations = registrationsRes.data || [];

      // Calculate statistics
      return {
        totalUsers: users.length,
        totalSellers: sellers.length,
        totalProducts: products.length,
        pendingApprovals: registrations.filter(r => r.status === 'Pending').length,
        
        // Additional stats you can derive
        activeUsers: users.filter(u => u.isActive).length,
        approvedSellers: sellers.filter(s => s.status === 'Approved').length,
        
        // Raw data for further processing in components
        users,
        sellers,
        products,
        registrations,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get user growth data (if createdDate is available)
   */
  async getUserGrowth() {
    try {
      const response = await apiClient.get('/users');
      const users = response.data || [];

      // Group users by month (assuming createdDate exists)
      const growthByMonth = users.reduce((acc, user) => {
        if (user.createdDate) {
          const month = new Date(user.createdDate).toISOString().slice(0, 7); // YYYY-MM
          acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
      }, {});

      return Object.entries(growthByMonth).map(([month, count]) => ({
        month,
        count,
      }));
    } catch (error) {
      console.error('Error fetching user growth:', error);
      throw error;
    }
  },

  /**
   * Get top sellers by product count
   */
  async getTopSellers(limit = 5) {
    try {
      const response = await apiClient.get('/product');
      const products = response.data || [];

      // Count products per seller
      const sellerProductCount = products.reduce((acc, product) => {
        const sellerId = product.sellerId || product.seller_id;
        acc[sellerId] = (acc[sellerId] || 0) + 1;
        return acc;
      }, {});

      // Get seller details
      const sellersRes = await apiClient.get('/seller');
      const sellers = sellersRes.data || [];

      // Combine and sort
      const topSellers = sellers
        .map(seller => ({
          ...seller,
          productCount: sellerProductCount[seller.sellerId || seller.seller_id] || 0,
        }))
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, limit);

      return topSellers;
    } catch (error) {
      console.error('Error fetching top sellers:', error);
      throw error;
    }
  },
};

export default dashboardApi;
