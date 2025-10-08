// src/services/userApi.js
import api from "./apiClient";

/**
 * GET /users/:id
 * Kỳ vọng BE trả:
 * {
 *   "userId": 1,
 *   "fullName": "Shop ABC",
 *   "username": "shopabc",
 *   "profilePicture": "https://..."
 * }
 */
export async function getUserById(userId) {
  const { data } = await api.get(`api/Users/${userId}`);
  return data;
}
