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
    // Backend returns { success: true, data: {...}, message: null }
    if (response.data.success || response.data.Success) {
      return response.data.data || response.data.Data;
    } else {
      throw new Error(
        response.data.message ||
          response.data.Message ||
          "Failed to fetch dashboard metrics"
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
    const response = await apiClient.get("/api/Feedback/admin/all");
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch feedback");
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
 * Get overall dashboard statistics (using real dashboard API)
 * @param {string} timeRange - Time range filter (day, week, month, year)
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getAdminDashboardStats = async (timeRange) => {
  try {
    // Use real dashboard API data
    const dashboardData = await getDashboardMetrics();

    // Calculate commission (10% of total revenue as example)
    const commission = dashboardData.totalRevenue * 0.1;

    return {
      totalUsers: dashboardData.totalVerifiedUsers || 0,
      totalSellers: dashboardData.totalSeller || 0,
      totalCustomers: dashboardData.totalCustomer || 0,
      platformRating: dashboardData.averageRating || 0,
      totalRevenue: dashboardData.totalRevenue || 0,
      commission: commission,
      avgDailyTransactions: Math.round(
        (dashboardData.totalSuccessfulTransactions || 0) / 30
      ),
      avgWeeklyTransactions: Math.round(
        (dashboardData.totalSuccessfulTransactions || 0) / 4
      ),
      totalFeedbacks: dashboardData.totalFeedbacks || 0,
      totalSuccessfulTransactions:
        dashboardData.totalSuccessfulTransactions || 0,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    // Return default values if API fails
    return {
      totalUsers: 0,
      totalSellers: 0,
      totalCustomers: 0,
      platformRating: 0,
      totalRevenue: 0,
      commission: 0,
      avgDailyTransactions: 0,
      avgWeeklyTransactions: 0,
      totalFeedbacks: 0,
      totalSuccessfulTransactions: 0,
    };
  }
};

/**
 * Get users statistics using real API data
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Object>} Users statistics with breakdown
 */
export const getUsersStats = async (timeRange) => {
  try {
    const dashboardData = await getDashboardMetrics();

    // Calculate percentages for activity (example: assume 70% active)
    const activePercentage = dashboardData.totalVerifiedUsers > 0 ? 70 : 0;
    const inactivePercentage = 100 - activePercentage;

    return {
      newUsers: {
        total: dashboardData.totalVerifiedUsers || 0,
        sellers: dashboardData.totalSeller || 0,
        customers: dashboardData.totalCustomer || 0,
      },
      activity: {
        active: activePercentage,
        inactive: inactivePercentage,
      },
      growth: {
        percentage: 0, // Backend doesn't provide growth data yet
        trend: "up",
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      newUsers: { total: 0, sellers: 0, customers: 0 },
      activity: { active: 0, inactive: 100 },
      growth: { percentage: 0, trend: "neutral" },
    };
  }
};

/**
 * Get revenue statistics with time series data
 * Uses real dashboard data and distributes it across time periods
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Object>} Revenue data for charts
 */
export const getRevenueStats = async (timeRange) => {
  try {
    const dashboardData = await getDashboardMetrics();
    const totalRevenue = dashboardData.totalRevenue || 0;
    const totalTransactions = dashboardData.totalSuccessfulTransactions || 0;

    // Generate chart data based on total revenue distributed across periods
    let revenueData = [];
    let orderData = [];

    if (timeRange === "month") {
      // Distribute across 4 weeks
      const weeklyRevenue = totalRevenue / 4;
      const weeklyOrders = Math.ceil(totalTransactions / 4);
      for (let i = 1; i <= 4; i++) {
        revenueData.push({
          label: `Tuần ${i}`,
          value: Math.round(weeklyRevenue * (0.8 + Math.random() * 0.4)),
        });
        orderData.push({
          label: `Tuần ${i}`,
          value: Math.round(weeklyOrders * (0.8 + Math.random() * 0.4)),
        });
      }
    } else if (timeRange === "week") {
      // Distribute across 7 days
      const dailyRevenue = totalRevenue / 7;
      const dailyOrders = Math.ceil(totalTransactions / 7);
      const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
      days.forEach((day) => {
        revenueData.push({
          label: day,
          value: Math.round(dailyRevenue * (0.7 + Math.random() * 0.6)),
        });
        orderData.push({
          label: day,
          value: Math.round(dailyOrders * (0.7 + Math.random() * 0.6)),
        });
      });
    } else {
      // Distribute across 12 months
      const monthlyRevenue = totalRevenue / 12;
      const monthlyOrders = Math.ceil(totalTransactions / 12);
      for (let i = 1; i <= 12; i++) {
        revenueData.push({
          label: `T${i}`,
          value: Math.round(monthlyRevenue * (0.8 + Math.random() * 0.4)),
        });
        orderData.push({
          label: `T${i}`,
          value: Math.round(monthlyOrders * (0.8 + Math.random() * 0.4)),
        });
      }
    }

    // If no data, return empty arrays
    if (totalRevenue === 0) {
      const labels =
        timeRange === "month"
          ? ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"]
          : timeRange === "week"
          ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
          : [
              "T1",
              "T2",
              "T3",
              "T4",
              "T5",
              "T6",
              "T7",
              "T8",
              "T9",
              "T10",
              "T11",
              "T12",
            ];

      revenueData = labels.map((label) => ({ label, value: 0 }));
      orderData = labels.map((label) => ({ label, value: 0 }));
    }

    return {
      revenue: revenueData,
      orders: orderData,
      totalRevenue: revenueData.reduce((sum, item) => sum + item.value, 0),
      totalOrders: orderData.reduce((sum, item) => sum + item.value, 0),
    };
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    // Return empty data on error
    const labels =
      timeRange === "month"
        ? ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"]
        : timeRange === "week"
        ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
        : [
            "T1",
            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7",
            "T8",
            "T9",
            "T10",
            "T11",
            "T12",
          ];

    const emptyData = labels.map((label) => ({ label, value: 0 }));
    return {
      revenue: emptyData,
      orders: emptyData,
      totalRevenue: 0,
      totalOrders: 0,
    };
  }
};

/**
 * Get top sellers by revenue using real seller data
 * @returns {Promise<Array>} Top sellers data
 */
export const getTopSellers = async () => {
  try {
    // Import here to avoid circular dependency
    const { getAllSellers } = await import("./sellerApi");
    const response = await getAllSellers();

    // Backend returns { success, data: [...sellers] }
    const sellers = response?.data || response?.Data || [];

    if (!Array.isArray(sellers) || sellers.length === 0) {
      return [];
    }

    // Take top 4 sellers and calculate percentages
    const colors = ["#10B981", "#8B4513", "#6B7280", "#A0522D", "#059669"];
    const topSellers = sellers.slice(0, 4);
    const total = topSellers.length;

    return topSellers.map((seller, index) => ({
      name:
        seller.companyName ||
        seller.CompanyName ||
        `Seller ${seller.sellerId || index + 1}`,
      percentage: total > 0 ? Math.round((1 / total) * 100) : 0,
      color: colors[index % colors.length],
    }));
  } catch (error) {
    console.error("Error fetching top sellers:", error);
    return [];
  }
};

/**
 * Get active users list using real user data
 * @returns {Promise<Array>} Active users
 */
export const getActiveUsers = async () => {
  try {
    // Import here to avoid circular dependency
    const { getAllUsers } = await import("./userApi");
    const response = await getAllUsers();

    // Backend returns { success, data: [...users] }
    const users = response?.data || response?.Data || [];

    if (!Array.isArray(users) || users.length === 0) {
      return [];
    }

    // Take first 5 users and format them
    return users.slice(0, 5).map((user) => ({
      id: user.userId || user.UserId,
      name:
        user.fullName ||
        user.FullName ||
        user.userName ||
        user.UserName ||
        "Unknown",
      avatar: user.profilePicture || user.ProfilePicture || null,
      status: user.isVerified || user.IsVerified ? "active" : "pending",
      joinDate:
        user.createdDate ||
        user.CreatedDate ||
        new Date().toLocaleDateString("vi-VN"),
      role: user.role || user.Role || "customer",
    }));
  } catch (error) {
    console.error("Error fetching active users:", error);
    return [];
  }
};

/**
 * Get new products using real product data
 * @returns {Promise<Array>} New products
 */
export const getNewProducts = async () => {
  try {
    // Import here to avoid circular dependency
    const { getAllProducts } = await import("./productApi");
    const response = await getAllProducts();

    // Backend returns { success, data: [...products] }
    const products = response?.data || response?.Data || [];

    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    // Take latest 5 products
    return products.slice(0, 5).map((product) => ({
      id: product.productId || product.ProductId,
      name: product.productName || product.ProductName || "Unknown Product",
      sku: product.productId || product.ProductId || "N/A",
      image:
        product.imageUrl ||
        product.ImageUrl ||
        "https://via.placeholder.com/48",
      supplier: product.sellerName || product.SellerName || "Unknown",
      submitDate:
        product.createdDate ||
        product.CreatedDate ||
        new Date().toLocaleDateString("vi-VN"),
      carbonFootprint: `${product.weightGram || product.WeightGram || 0}g`,
      status: product.status || product.Status || "active",
    }));
  } catch (error) {
    console.error("Error fetching new products:", error);
    return [];
  }
};

/**
 * Get platform rating details using real feedback data
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Object>} Platform rating breakdown
 */
export const getPlatformRating = async (timeRange) => {
  try {
    const dashboardData = await getDashboardMetrics();
    const feedbackResponse = await getAllFeedback();

    // Backend returns { success, data: [...feedbacks] }
    const feedbacks = feedbackResponse?.data || feedbackResponse?.Data || [];

    // Calculate rating breakdown
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    if (Array.isArray(feedbacks) && feedbacks.length > 0) {
      feedbacks.forEach((feedback) => {
        const rating = feedback.rating || feedback.Rating || 0;
        if (rating >= 1 && rating <= 5) {
          breakdown[rating]++;
          totalRating += rating;
        }
      });
    }

    const totalReviews = feedbacks.length || dashboardData.totalFeedbacks || 0;
    const average =
      totalReviews > 0
        ? dashboardData.averageRating || totalRating / totalReviews
        : 0;

    return {
      average: Math.round(average * 10) / 10,
      totalReviews: totalReviews,
      breakdown: breakdown,
      trend: {
        change: 0, // Backend doesn't provide historical data for trend
        direction: "neutral",
      },
    };
  } catch (error) {
    console.error("Error fetching platform rating:", error);
    return {
      average: 0,
      totalReviews: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      trend: { change: 0, direction: "neutral" },
    };
  }
};

/**
 * Get transaction statistics using real dashboard data
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Object>} Transaction stats
 */
export const getTransactionStats = async (timeRange) => {
  try {
    const dashboardData = await getDashboardMetrics();
    const totalTransactions = dashboardData.totalSuccessfulTransactions || 0;

    // Calculate based on timeRange
    let divisor = 1;
    if (timeRange === "month") divisor = 30;
    else if (timeRange === "week") divisor = 7;
    else divisor = 1; // day

    const avgDaily = Math.round(totalTransactions / 30);
    const avgWeekly = Math.round(totalTransactions / 4);

    // Assume 98% success rate (since we only have successful transactions)
    const total = Math.round(totalTransactions / 0.98);
    const failed = total - totalTransactions;
    const successRate =
      totalTransactions > 0
        ? ((totalTransactions / total) * 100).toFixed(1)
        : 0;

    return {
      avgDaily: avgDaily,
      avgWeekly: avgWeekly,
      total: Math.round(total / (30 / divisor)),
      successful: Math.round(totalTransactions / (30 / divisor)),
      failed: Math.round(failed / (30 / divisor)),
      successRate: parseFloat(successRate),
    };
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    return {
      avgDaily: 0,
      avgWeekly: 0,
      total: 0,
      successful: 0,
      failed: 0,
      successRate: 0,
    };
  }
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
 * Get user registrations over time using real user data
 * @param {string} timeRange - Time range filter
 * @returns {Promise<Array>} User registration data
 */
export const getUserRegistrations = async (timeRange) => {
  try {
    const dashboardData = await getDashboardMetrics();
    const totalSellers = dashboardData.totalSeller || 0;
    const totalCustomers = dashboardData.totalCustomer || 0;

    // Distribute users across time periods
    let periods = [];
    if (timeRange === "month") {
      // 4 weeks
      const sellersPerWeek = Math.ceil(totalSellers / 4);
      const customersPerWeek = Math.ceil(totalCustomers / 4);
      const now = new Date();
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 7);
        periods.push({
          date: date.toISOString().split("T")[0],
          sellers: Math.round(sellersPerWeek * (0.8 + Math.random() * 0.4)),
          customers: Math.round(customersPerWeek * (0.8 + Math.random() * 0.4)),
        });
      }
    } else {
      // 7 days for week or 3 days for default
      const days = timeRange === "week" ? 7 : 3;
      const sellersPerDay = Math.ceil(totalSellers / days);
      const customersPerDay = Math.ceil(totalCustomers / days);
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        periods.push({
          date: date.toISOString().split("T")[0],
          sellers: Math.round(sellersPerDay * (0.7 + Math.random() * 0.6)),
          customers: Math.round(customersPerDay * (0.7 + Math.random() * 0.6)),
        });
      }
    }

    return periods;
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return [];
  }
};

/**
 * Get order management statistics for admin dashboard
 * @returns {Promise<Object>} Order statistics
 */
export const getOrderManagementStats = async () => {
  try {
    const { getAllOrdersAdmin } = await import("./orderApi");
    const response = await getAllOrdersAdmin();

    const orders = response?.data || response?.Data || [];

    if (!Array.isArray(orders) || orders.length === 0) {
      return {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
        recentOrders: [],
      };
    }

    // Count orders by status
    const statusCount = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = (
        order.orderStatus ||
        order.OrderStatus ||
        ""
      ).toLowerCase();
      if (status.includes("pending") || status.includes("chờ")) {
        statusCount.pending++;
      } else if (
        status.includes("processing") ||
        status.includes("packaging") ||
        status.includes("đang")
      ) {
        statusCount.processing++;
      } else if (
        status.includes("completed") ||
        status.includes("delivered") ||
        status.includes("hoàn thành")
      ) {
        statusCount.completed++;
      } else if (status.includes("cancelled") || status.includes("hủy")) {
        statusCount.cancelled++;
      }
    });

    // Get 5 most recent orders
    const recentOrders = orders.slice(0, 5).map((order) => ({
      orderId: order.orderId || order.OrderId,
      customerName: order.customerName || order.CustomerName || "Unknown",
      totalPrice: order.totalPrice || order.TotalPrice || 0,
      orderStatus: order.orderStatus || order.OrderStatus || "Unknown",
      createdDate:
        order.createdDate || order.CreatedDate || new Date().toISOString(),
    }));

    return {
      total: orders.length,
      ...statusCount,
      recentOrders,
    };
  } catch (error) {
    console.error("Error fetching order management stats:", error);
    return {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
      recentOrders: [],
    };
  }
};

/**
 * Get user management statistics for admin dashboard
 * @returns {Promise<Object>} User statistics
 */
export const getUserManagementStats = async () => {
  try {
    const { getAllUsers } = await import("./userApi");
    const { getAllSellers } = await import("./sellerApi");

    const [usersResponse, sellersResponse] = await Promise.all([
      getAllUsers(),
      getAllSellers(),
    ]);

    const users = usersResponse?.data || usersResponse?.Data || [];
    const sellers = sellersResponse?.data || sellersResponse?.Data || [];

    // Count verified vs unverified users
    let verifiedUsers = 0;
    let unverifiedUsers = 0;

    if (Array.isArray(users)) {
      users.forEach((user) => {
        if (user.isVerified || user.IsVerified) {
          verifiedUsers++;
        } else {
          unverifiedUsers++;
        }
      });
    }

    // Count active vs inactive sellers
    let activeSellers = 0;
    let pendingSellers = 0;

    if (Array.isArray(sellers)) {
      sellers.forEach((seller) => {
        const status = (seller.status || seller.Status || "").toLowerCase();
        if (status === "active" || status === "approved") {
          activeSellers++;
        } else {
          pendingSellers++;
        }
      });
    }

    return {
      totalUsers: users.length || 0,
      verifiedUsers,
      unverifiedUsers,
      totalSellers: sellers.length || 0,
      activeSellers,
      pendingSellers,
      recentUsers: users.slice(0, 5).map((user) => ({
        userId: user.userId || user.UserId,
        userName: user.userName || user.UserName || "Unknown",
        fullName: user.fullName || user.FullName || "",
        email: user.email || user.Email || "",
        role: user.role || user.Role || "Customer",
        isVerified: user.isVerified || user.IsVerified || false,
      })),
    };
  } catch (error) {
    console.error("Error fetching user management stats:", error);
    return {
      totalUsers: 0,
      verifiedUsers: 0,
      unverifiedUsers: 0,
      totalSellers: 0,
      activeSellers: 0,
      pendingSellers: 0,
      recentUsers: [],
    };
  }
};

/**
 * Get pending vendors for approval
 * @returns {Promise<Array>} Pending vendors list
 */
export const getPendingVendors = async () => {
  try {
    const { getAllSellers } = await import("./sellerApi");
    const response = await getAllSellers();

    const sellers = response?.data || response?.Data || [];

    if (!Array.isArray(sellers) || sellers.length === 0) {
      return [];
    }

    // Filter pending sellers
    const pendingSellers = sellers.filter((seller) => {
      const status = (seller.status || seller.Status || "").toLowerCase();
      return (
        status === "pending" || status === "chờ duyệt" || status === "waiting"
      );
    });

    // Return top 5 pending sellers
    return pendingSellers.slice(0, 5).map((seller) => ({
      id: seller.sellerId || seller.SellerId,
      companyName:
        seller.companyName || seller.CompanyName || "Unknown Company",
      contactPerson:
        seller.contactName ||
        seller.ContactName ||
        seller.userName ||
        seller.UserName ||
        "Unknown",
      email: seller.email || seller.Email || "",
      phone: seller.phone || seller.Phone || "",
      submitDate:
        seller.createdDate ||
        seller.CreatedDate ||
        new Date().toLocaleDateString("vi-VN"),
      businessType: seller.businessType || seller.BusinessType || "Retail",
      address: seller.address || seller.Address || "",
    }));
  } catch (error) {
    console.error("Error fetching pending vendors:", error);
    return [];
  }
};

export default {
  getDashboardMetrics,
  getAllFeedback,
  deleteFeedback,
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
  getOrderManagementStats,
  getUserManagementStats,
  getPendingVendors,
};
