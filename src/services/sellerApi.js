// src/services/sellerApi.js
import apiClient from "./apiClient";

/**
 * Seller API Services
 */

// Get all sellers (Admin only)
export const getAllSellers = async () => {
  const response = await apiClient.get("/api/seller");
  return response.data;
};

// Get seller by ID (Admin only)
export const getSellerById = async (id) => {
  const response = await apiClient.get(`/api/seller/${id}`);
  return response.data;
};

// Get current seller info (for logged-in seller)
export const getMySellerInfo = async () => {
  const response = await apiClient.get("/api/seller/me");
  return response.data;
};

// Update seller information (including bank details)
export const updateSeller = async (formData) => {
  const response = await apiClient.put("/api/seller", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete seller (Admin only)
export const deleteSeller = async (id) => {
  const response = await apiClient.delete(`/api/seller/${id}`);
  return response.data;
};
