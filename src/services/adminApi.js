// Admin Dashboard API Service
// Placeholder functions for admin statistics and data

import apiClient from "./apiClient";

/**
 * Get dashboard metrics from backend API
 * @returns {Promise<Object>} Dashboard metrics
 */
export const getDashboardMetrics = async () => {
  try {
    const response = await apiClient.get("/api/Dashboard");
    if (response.data.Success) {
      return response.data.Data;
    } else {
      throw new Error(
        response.data.Message || "Failed to fetch dashboard metrics"
      );
    }
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
};

/**
 * Get all feedback for admin management
 * @returns {Promise<Array>} Array of feedback objects
 */
export const getAllFeedback = async () => {
  try {
    const response = await apiClient.get("/Feedback/admin/all");
    if (response.data.Success) {
      return response.data.Data;
    } else {
      throw new Error(response.data.Message || "Failed to fetch feedback");
    }
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

/**
 * Delete a feedback by admin
 * @param {number} feedbackId - ID of the feedback to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await apiClient.delete(`/Feedback/admin/${feedbackId}`);
    if (response.data.Success) {
      return response.data;
    } else {
      throw new Error(response.data.Message || "Failed to delete feedback");
    }
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};

/**
 * Get overall dashboard statistics
 * @param {string} timeRange - Time range filter (day, week, month, year)
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getAdminDashboardStats = async (timeRange) => {
  // Mock data for additional stats not provided by backend
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        totalUsers:
          timeRange === "year" ? 15432 : timeRange === "month" ? 3245 : 856,
        totalSellers:
          timeRange === "year" ? 3821 : timeRange === "month" ? 856 : 234,
        totalCustomers:
          timeRange === "year" ? 11611 : timeRange === "month" ? 2389 : 622,
        platformRating: 4.8,
        totalRevenue:
          timeRange === "year"
            ? 15840000000
            : timeRange === "month"
            ? 2450000000
            : 450000000,
        commission:
          timeRange === "year"
            ? 1584000000
            : timeRange === "month"
            ? 245000000
            : 45000000,
        avgDailyTransactions:
          timeRange === "year" ? 156 : timeRange === "month" ? 124 : 45,
        avgWeeklyTransactions:
          timeRange === "year" ? 1092 : timeRange === "month" ? 868 : 315,
      };
      resolve(mockData);
    }, 500);
  });
};

/**
 * Get users statistics
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Object>} Users statistics with breakdown
 */
export const getUsersStats = async (timeRange) => {
  // Mock data for user activity stats
  console.log("Fetching user stats for:", timeRange);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        newUsers: {
          total: 245,
          sellers: 67,
          customers: 178,
        },
        activity: {
          active: 65,
          inactive: 35,
        },
        growth: {
          percentage: 12,
          trend: "up",
        },
      });
    }, 500);
  });
};

/**
 * Get revenue statistics with time series data
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Object>} Revenue data for charts
 */
export const getRevenueStats = async (timeRange) => {
  // Mock data - replace with actual API when backend is ready

  return new Promise((resolve) => {
    setTimeout(() => {
      const revenueData =
        timeRange === "month"
          ? [
              { label: "T1", value: 45000000 },
              { label: "T2", value: 78000000 },
              { label: "T3", value: 92000000 },
              { label: "T4", value: 125000000 },
            ]
          : timeRange === "week"
          ? [
              { label: "T2", value: 12000000 },
              { label: "T3", value: 18000000 },
              { label: "T4", value: 15000000 },
              { label: "T5", value: 22000000 },
              { label: "T6", value: 25000000 },
              { label: "T7", value: 28000000 },
              { label: "CN", value: 20000000 },
            ]
          : [
              { label: "T1", value: 450000000 },
              { label: "T2", value: 580000000 },
              { label: "T3", value: 720000000 },
              { label: "T4", value: 890000000 },
              { label: "T5", value: 950000000 },
              { label: "T6", value: 1020000000 },
              { label: "T7", value: 1150000000 },
              { label: "T8", value: 1280000000 },
              { label: "T9", value: 1420000000 },
              { label: "T10", value: 1350000000 },
              { label: "T11", value: 1480000000 },
              { label: "T12", value: 1620000000 },
            ];

      const orderData =
        timeRange === "month"
          ? [
              { label: "T1", value: 245 },
              { label: "T2", value: 389 },
              { label: "T3", value: 456 },
              { label: "T4", value: 521 },
            ]
          : timeRange === "week"
          ? [
              { label: "T2", value: 45 },
              { label: "T3", value: 52 },
              { label: "T4", value: 48 },
              { label: "T5", value: 67 },
              { label: "T6", value: 72 },
              { label: "T7", value: 85 },
              { label: "CN", value: 62 },
            ]
          : [
              { label: "T1", value: 1245 },
              { label: "T2", value: 1489 },
              { label: "T3", value: 1756 },
              { label: "T4", value: 2012 },
              { label: "T5", value: 2234 },
              { label: "T6", value: 2456 },
              { label: "T7", value: 2678 },
              { label: "T8", value: 2890 },
              { label: "T9", value: 3012 },
              { label: "T10", value: 2934 },
              { label: "T11", value: 3156 },
              { label: "T12", value: 3378 },
            ];

      resolve({
        revenue: revenueData,
        orders: orderData,
        totalRevenue: revenueData.reduce((sum, item) => sum + item.value, 0),
        totalOrders: orderData.reduce((sum, item) => sum + item.value, 0),
      });
    }, 500);
  });
};

/**
 * Get top sellers by revenue
 * @returns {Promise<Array>} Top sellers data
 */
export const getTopSellers = async () => {
  // Mock data - replace with actual API when backend is ready

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "Green Pack Co.", percentage: 35, color: "#10B981" },
        { name: "Minh Khang", percentage: 25, color: "#8B4513" },
        { name: "EcoBox Ltd.", percentage: 20, color: "#6B7280" },
        { name: "Nature Wrap", percentage: 20, color: "#A0522D" },
      ]);
    }, 500);
  });
};

/**
 * Get active users list
 * @returns {Promise<Array>} Active users
 */
export const getActiveUsers = async () => {
  // Mock data - replace with actual API when backend is ready

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Nguyễn Văn A",
          avatar: null,
          status: "active",
          joinDate: "15/09/2025",
          role: "seller",
        },
        {
          id: 2,
          name: "Trần Thị B",
          avatar: null,
          status: "pending",
          joinDate: "10/10/2025",
          role: "seller",
        },
        {
          id: 3,
          name: "Lê Minh C",
          avatar: null,
          status: "blocked",
          joinDate: "05/09/2025",
          role: "customer",
        },
      ]);
    }, 500);
  });
};

/**
 * Get new products awaiting approval
 * @returns {Promise<Array>} New products
 */
export const getNewProducts = async () => {
  // Mock data - replace with actual API when backend is ready

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Túi giấy kraft",
          sku: "KH-15 - 10/2025",
          image: "https://via.placeholder.com/48",
          supplier: "Green Pack Co.",
          submitDate: "24 thg. 9/21 lúc 16:25",
          carbonFootprint: "0.3 kg CO2e",
          status: "pending",
        },
        {
          id: 2,
          name: "Hộp dựng thực phẩm",
          sku: "BA-10 - tui keo",
          image: "https://via.placeholder.com/48",
          supplier: "EcoBox Ltd.",
          submitDate: "24 thg. 9/21 lúc 16:25",
          carbonFootprint: "3.4 kg CO2e",
          status: "pending",
        },
      ]);
    }, 500);
  });
};

/**
 * Get platform rating details
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Object>} Platform rating breakdown
 */
export const getPlatformRating = async (timeRange) => {
  // Mock data - replace with actual API when backend is ready
  console.log("Fetching platform rating for:", timeRange);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        average: 4.8,
        totalReviews: 1245,
        breakdown: {
          5: 856,
          4: 289,
          3: 67,
          2: 23,
          1: 10,
        },
        trend: {
          change: 0.2,
          direction: "up",
        },
      });
    }, 500);
  });
};

/**
 * Get transaction statistics
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Object>} Transaction stats
 */
export const getTransactionStats = async (timeRange) => {
  // Mock data - replace with actual API when backend is ready

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        avgDaily: 124,
        avgWeekly: 868,
        total: timeRange === "month" ? 3245 : timeRange === "week" ? 856 : 124,
        successful:
          timeRange === "month" ? 3156 : timeRange === "week" ? 834 : 120,
        failed: timeRange === "month" ? 89 : timeRange === "week" ? 22 : 4,
        successRate: 97.2,
      });
    }, 500);
  });
};

/**
 * Export dashboard report
 * @param {string} timeRange - Time range for report
 * @param {string} format - Export format (pdf, csv, excel)
 * @returns {Promise<Blob>} Report file
 */
export const exportDashboardReport = async (timeRange, format = "pdf") => {
  // Mock data - replace with actual API when backend is ready

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Blob([""], { type: `application/${format}` }));
    }, 1000);
  });
};

/**
 * Get user registrations over time
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Array>} User registration data
 */
export const getUserRegistrations = async (timeRange) => {
  // Mock data - replace with actual API when backend is ready

  return new Promise((resolve) => {
    setTimeout(() => {
      const data =
        timeRange === "month"
          ? [
              { date: "2025-10-01", sellers: 12, customers: 45 },
              { date: "2025-10-08", sellers: 18, customers: 56 },
              { date: "2025-10-15", sellers: 24, customers: 67 },
              { date: "2025-10-22", sellers: 31, customers: 78 },
            ]
          : [
              { date: "2025-10-13", sellers: 3, customers: 12 },
              { date: "2025-10-14", sellers: 5, customers: 15 },
              { date: "2025-10-15", sellers: 4, customers: 18 },
            ];

      resolve(data);
    }, 500);
  });
};

export default {
  getAdminDashboardStats,
  getUsersStats,
  getRevenueStats,
  getTopSellers,
  getActiveUsers,
  getNewProducts,
  getPlatformRating,
  getTransactionStats,
  exportDashboardReport,
  getUserRegistrations,
};
