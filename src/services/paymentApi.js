// src/services/paymentApi.js
import apiClient from "./apiClient";

/**
 * Payment API Services
 * Handles PayOS payment integration
 */

/**
 * Create payment link for an order
 * @param {number} orderId - Order ID to create payment for
 * @returns {Promise} Payment link response with checkoutUrl
 */
export const createPaymentLink = async (orderId) => {
  const response = await apiClient.post("/api/payment/create-link", {
    orderId,
  });
  return response.data;
};

/**
 * Verify payment webhook from PayOS
 * This is typically called by PayOS, not directly from frontend
 */
export const verifyPaymentWebhook = async (webhookData) => {
  const response = await apiClient.post("/api/payment/webhook", webhookData);
  return response.data;
};
