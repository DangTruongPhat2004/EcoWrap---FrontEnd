import apiClient from "./apiClient";

export const createFeedback = async (feedbackData) => {
  const response = await apiClient.post("/api/Feedback", feedbackData);
  // Handle both 'success' (lowercase) and 'Success' (uppercase)
  const isSuccess =
    response.data.success !== false && response.data.Success !== false;
  if (isSuccess) {
    return response.data;
  }
  throw new Error(
    response.data.message ||
      response.data.Message ||
      "Failed to create feedback"
  );
};

export const getMyFeedback = async () => {
  const response = await apiClient.get("/api/Feedback/my-feedback");
  // Handle both 'success' (lowercase) and 'Success' (uppercase)
  const isSuccess =
    response.data.success !== false && response.data.Success !== false;
  if (isSuccess) {
    return response.data.data || response.data.Data || [];
  }
  throw new Error(
    response.data.message || response.data.Message || "Failed to fetch feedback"
  );
};

export const updateMyFeedback = async (feedbackId, feedbackData) => {
  const response = await apiClient.put(
    `/api/Feedback/my-feedback/${feedbackId}`,
    feedbackData
  );
  // Handle both 'success' (lowercase) and 'Success' (uppercase)
  const isSuccess =
    response.data.success !== false && response.data.Success !== false;
  if (isSuccess) {
    return response.data;
  }
  throw new Error(
    response.data.message ||
      response.data.Message ||
      "Failed to update feedback"
  );
};

export const deleteMyFeedback = async (feedbackId) => {
  const response = await apiClient.delete(
    `/api/Feedback/my-feedback/${feedbackId}`
  );
  // Handle both 'success' (lowercase) and 'Success' (uppercase)
  const isSuccess =
    response.data.success !== false && response.data.Success !== false;
  if (isSuccess) {
    return response.data;
  }
  throw new Error(
    response.data.message ||
      response.data.Message ||
      "Failed to delete feedback"
  );
};
