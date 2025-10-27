// src/services/userApi.js
import api from "./apiClient";

/**
 * GET /api/Users
 * Get all users
 */
export async function getAllUsers() {
  const { data } = await api.get("api/Users");
  return data;
}

/**
 * GET /api/Users/:id
 * Get user by ID
 */
export async function getUserById(userId) {
  const { data } = await api.get(`api/Users/${userId}`);
  return data;
}

/**
 * PUT /api/Users/:id
 * Update user
 */
export async function updateUser(userId, userData) {
  const { data } = await api.put(`api/Users/${userId}`, userData);
  return data;
}

/**
 * DELETE /api/Users/:id
 * Delete user
 */
export async function deleteUser(userId) {
  const { data } = await api.delete(`api/Users/${userId}`);
  return data;
}

/**
 * POST /api/Users/change-password
 * Change password
 */
export async function changePassword(oldPassword, newPassword) {
  const { data } = await api.post("api/Users/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
}
