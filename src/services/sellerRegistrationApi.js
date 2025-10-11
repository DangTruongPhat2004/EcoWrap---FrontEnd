// src/services/sellerRegistrationApi.js
import apiClient from "./apiClient";

/**
 * Submit a seller registration form
 * @param {FormData} formData - The form data containing seller registration info
 * @returns {Promise} Response from the API
 */
export const submitSellerRegistration = async (formData) => {
  try {
    const response = await apiClient.post(
      "/api/SellerRegistration/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting seller registration:", error);
    throw error;
  }
};

/**
 * Get all seller registrations (Admin only)
 * @returns {Promise} List of all registrations
 */
export const getAllRegistrations = async () => {
  try {
    const response = await apiClient.get("/api/SellerRegistration/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all registrations:", error);
    throw error;
  }
};

/**
 * Get registrations by user ID
 * @param {number} userId - The user ID
 * @returns {Promise} List of registrations for the user
 */
export const getRegistrationsByUserId = async (userId) => {
  try {
    const response = await apiClient.get(
      `/api/SellerRegistration/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching registrations by user:", error);
    throw error;
  }
};

/**
 * Get a single registration by ID
 * @param {number} registrationId - The registration ID
 * @returns {Promise} Registration details
 */
export const getRegistrationById = async (registrationId) => {
  try {
    const response = await apiClient.get(
      `/api/SellerRegistration/${registrationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching registration by ID:", error);
    throw error;
  }
};

/**
 * Get registrations by status (Admin only)
 * @param {string} status - The status to filter by (Pending, Approved, Canceled)
 * @returns {Promise} List of registrations with the specified status
 */
export const getRegistrationsByStatus = async (status) => {
  try {
    const response = await apiClient.get(
      `/api/SellerRegistration/status/${status}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching registrations by status:", error);
    throw error;
  }
};

/**
 * Approve a seller registration (Admin only)
 * @param {number} registrationId - The registration ID to approve
 * @returns {Promise} Response from the API
 */
export const approveRegistration = async (registrationId) => {
  try {
    const response = await apiClient.put(
      `/api/SellerRegistration/approve/${registrationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error approving registration:", error);
    throw error;
  }
};

/**
 * Reject a seller registration (Admin only)
 * @param {number} registrationId - The registration ID to reject
 * @param {string} reason - The reason for rejection
 * @returns {Promise} Response from the API
 */
export const adminRejectRegistration = async (registrationId, reason) => {
  try {
    const response = await apiClient.put(
      `/api/SellerRegistration/reject/${registrationId}`,
      { reason }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting registration:", error);
    throw error;
  }
};

/**
 * User cancels their own registration
 * @param {number} registrationId - The registration ID to cancel
 * @returns {Promise} Response from the API
 */
export const userCancelRegistration = async (registrationId) => {
  try {
    const response = await apiClient.put(
      `/api/SellerRegistration/user/cancel/${registrationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling registration:", error);
    throw error;
  }
};
