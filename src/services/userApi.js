// src/services/userApi.js
import api from "./apiClient";

/**
 * GET /api/Users
 * Get all users
 */
export async function getAllUsers() {
  try {
    const response = await api.get("/api/Users");
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
    const response = await api.get(`/api/Users/${userId}`);
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
    // Backend expects multipart/form-data with these exact field names (case-sensitive)
    const formData = new FormData();

    // Backend UpdateUserRequest expects: Username, Email, FullName, PhoneNumber, ProfilePicture
    if (userData.userName !== undefined)
      formData.append("Username", userData.userName); // Note: "Username" not "UserName"
    if (userData.fullName !== undefined)
      formData.append("FullName", userData.fullName);
    if (userData.phoneNumber !== undefined)
      formData.append("PhoneNumber", userData.phoneNumber);
    if (userData.email !== undefined) formData.append("Email", userData.email);

    // If there's a profile picture file, append it
    if (userData.profilePicture instanceof File) {
      formData.append("ProfilePicture", userData.profilePicture);
    }

    // Debug: Log FormData contents
    console.log("Updating user with FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    // CRITICAL: Delete Content-Type to let browser set multipart/form-data with boundary automatically
    const response = await api.put(`/api/Users/${userId}`, formData, {
      headers: {
        "Content-Type": undefined, // This removes the default application/json header
      },
      transformRequest: [(data) => data], // Prevent axios from transforming FormData
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    console.error("Error response:", error?.response?.data);
    throw error;
  }
}

/**
 * DELETE /api/Users/:id
 * Delete user
 */
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/api/Users/${userId}`);
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
    // Backend expects OldPassword and NewPassword with capital letters
    const response = await api.post("/api/Users/change-password", {
      OldPassword: oldPassword,
      NewPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    console.error("Error response:", error?.response?.data);
    throw error;
  }
}
