// src/services/cartApi.js
import apiClient from "./apiClient";

/**
 * Cart API Services
 */

// Get all carts for current user
export const getAllCarts = async () => {
  const response = await apiClient.get("/api/cart");
  return response.data;
};

// Get cart by ID
export const getCartById = async (cartId) => {
  const response = await apiClient.get(`/api/cart/${cartId}`);
  return response.data;
};

// Create new cart
export const createCart = async () => {
  const response = await apiClient.post("/api/cart");
  return response.data;
};

// Delete cart
export const deleteCart = async (cartId) => {
  const response = await apiClient.delete(`/api/cart/${cartId}`);
  return response.data;
};

/**
 * Cart Item API Services
 */

// Add item to cart
export const addCartItem = async (formData) => {
  const response = await apiClient.post("/api/cartitem", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update cart item
export const updateCartItem = async (cartItemId, data) => {
  const response = await apiClient.put(`/api/cartitem/${cartItemId}`, data);
  return response.data;
};

// Delete cart item
export const deleteCartItem = async (cartItemId) => {
  const response = await apiClient.delete(`/api/cartitem/${cartItemId}`);
  return response.data;
};
