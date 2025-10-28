// src/services/orderApi.js
import apiClient from "./apiClient";

/**
 * Order API Services
 * Handles all order-related API calls
 */

/**
 * Create a new order from the active cart
 * @param {Object} orderData - Order information
 * @param {string} orderData.address - Detailed address (house number, street)
 * @param {string} orderData.province - Province/City
 * @param {string} orderData.district - District
 * @param {string} orderData.ward - Ward
 * @param {string} orderData.hamlet - Hamlet
 * @returns {Promise} Order creation response
 */
export const createOrder = async (orderData) => {
  const response = await apiClient.post("/api/order", orderData);
  return response.data;
};

/**
 * Get order by ID
 * @param {number} orderId - Order ID to fetch
 * @returns {Promise} Order details (transformed to match frontend structure)
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/order/${orderId}`);

    // Backend returns: { success, message, data: OrderDetailResponse }
    if (response.data.success && response.data.data) {
      const backendData = response.data.data;

      // Transform backend structure to frontend structure
      const transformedData = {
        orderId: backendData.orderId,
        code: backendData.orderId?.toString(), // Use orderId as code
        orderStatus: backendData.orderStatus,
        createdAt: backendData.createdDate,
        updatedAt: backendData.updatedDate,
        totalPrice: backendData.totalPrice,
        totalAmount: backendData.totalAmount,

        // Customer info
        customerId: backendData.customerId,
        customerName: backendData.customerName,
        customerEmail: backendData.customerEmail,
        customerPhone: backendData.customerPhone,

        // Shipping address
        shippingAddress: backendData.shippingAddress,
        shippingWard: backendData.shippingWard,
        shippingDistrict: backendData.shippingDistrict,
        shippingProvince: backendData.shippingProvince,
        shippingHamlet: backendData.shippingHamlet,

        // Shipping info
        transportUnit: backendData.transportUnit,
        shippingCode: backendData.shippingCode,

        // Transform items
        items:
          backendData.items?.map((item) => ({
            id: item.cartItemId,
            productId: item.productId,
            name: item.productName,
            thumb: item.productImageUrl,
            desc: item.designFile ? "Có thiết kế tùy chỉnh" : "",
            qty: item.quantity,
            price: item.pricePerItem,
            designFile: item.designFile,
          })) || [],
      };

      return {
        success: true,
        message: response.data.message,
        data: transformedData,
      };
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 501) {
      console.error("Backend GetOrderByIdAsync not implemented yet");
      return {
        success: false,
        message:
          "Chức năng xem chi tiết đơn hàng chưa được backend triển khai.",
      };
    }
    throw error;
  }
};

/**
 * Get all orders for the current user
 * WARNING: Backend endpoint is commented out and service throws NotImplementedException
 * This will not work until backend uncomments endpoint and implements GetAllOrderAsync
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (optional)
 * @param {number} params.page - Page number (optional)
 * @param {number} params.pageSize - Page size (optional)
 * @returns {Promise} List of orders
 */
export const getMyOrders = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/order/my-orders", { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 501 || error.response?.status === 404) {
      console.error("Backend GetAllOrderAsync not implemented yet");
      return {
        success: false,
        data: [],
        message:
          "Chức năng lấy danh sách đơn hàng chưa được backend triển khai. Backend cần implement GetAllOrderAsync trong OrderService.",
      };
    }
    throw error;
  }
};

/**
 * Admin: Get all orders in the system
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (optional)
 * @returns {Promise} List of all orders
 */
export const getAllOrdersAdmin = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/order/all", { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 501 || error.response?.status === 404) {
      console.error("Backend GetAllOrdersAdminAsync not implemented yet");
      return {
        success: false,
        data: [],
        message: "Chức năng lấy tất cả đơn hàng chưa được backend triển khai.",
      };
    }
    throw error;
  }
};

/**
 * Admin: Confirm packaging for an order
 * This moves order from "Pending" to "Packaging" status
 * @param {number} orderId - Order ID
 * @returns {Promise} Confirmation response
 */
export const confirmPackaging = async (orderId) => {
  const response = await apiClient.post(
    `/api/order/${orderId}/confirm-packaging`
  );
  return response.data;
};

/**
 * Admin: Confirm shipment for an order
 * This moves order from "Packaging" to "Shipping" status
 * @param {number} orderId - Order ID
 * @returns {Promise} Confirmation response
 */
export const confirmShipment = async (orderId) => {
  const response = await apiClient.post(
    `/api/order/${orderId}/confirm-shipment`
  );
  return response.data;
};

/**
 * Customer: Confirm delivery completion
 * This moves order from "Shipping" to "Completed" status
 * @param {number} orderId - Order ID
 * @returns {Promise} Confirmation response
 */
export const confirmDelivery = async (orderId) => {
  const response = await apiClient.post(
    `/api/order/${orderId}/confirm-delivery`
  );
  return response.data;
};

/**
 * Decline/Cancel an order
 * Can be used by admin or system (auto-cancel after 30 minutes)
 * @param {number} orderId - Order ID
 * @returns {Promise} Decline response
 */
export const declineOrder = async (orderId) => {
  const response = await apiClient.post(`/api/order/${orderId}/decline`);
  return response.data;
};

/**
 * Get order status label in Vietnamese
 * @param {string} status - Order status
 * @returns {string} Vietnamese label
 */
export const getOrderStatusLabel = (status) => {
  const statusLabels = {
    Pending: "Chờ thanh toán",
    Packaging: "Đang đóng gói",
    Shipping: "Đang giao hàng",
    Completed: "Hoàn thành",
    Canceled: "Đã hủy",
    Declined: "Đã từ chối",
  };
  return statusLabels[status] || status;
};

/**
 * Get order status color for UI
 * @param {string} status - Order status
 * @returns {string} Tailwind color class
 */
export const getOrderStatusColor = (status) => {
  const statusColors = {
    Pending: "text-orange-700 bg-orange-50 border-orange-200",
    Packaging: "text-blue-700 bg-blue-50 border-blue-200",
    Shipping: "text-purple-700 bg-purple-50 border-purple-200",
    Completed: "text-green-700 bg-green-50 border-green-200",
    Canceled: "text-red-700 bg-red-50 border-red-200",
    Declined: "text-gray-700 bg-gray-50 border-gray-200",
  };
  return statusColors[status] || "text-gray-700 bg-gray-50 border-gray-200";
};
