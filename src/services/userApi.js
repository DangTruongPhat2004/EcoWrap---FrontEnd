// src/services/userApi.js
import api from "./apiClient";

/**
 * GET /api/Users
 * Get all users
 */
export async function getAllUsers() {
  try {
    const response = await api.get("api/Users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * GET /api/Users/:id
 * Get user by ID
 */
export async function getUserById(userId) {
  try {
    const response = await api.get(`api/Users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

/**
 * PUT /api/Users/:id
 * Update user
 */
export async function updateUser(userId, userData) {
  try {
    const response = await api.put(`api/Users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * DELETE /api/Users/:id
 * Delete user
 */
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`api/Users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * POST /api/Users/change-password
 * Change password
 */
export async function changePassword(oldPassword, newPassword) {
  try {
    const response = await api.post("api/Users/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

/**
 * GET /api/Users/profile
 * Get current user's profile
 */
export async function getMyProfile() {
  try {
    const response = await api.get("api/Users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
