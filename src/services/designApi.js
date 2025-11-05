import apiClient from "./apiClient";

/**
 * Design/Customize API Service
 * Handles all operations for custom design management
 */

const designApi = {
  /**
   * Get list of designs with pagination and filters
   */
  async getDesigns({ page = 1, pageSize = 20, q = "", status = "" } = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    if (q) params.append("q", q);
    if (status) params.append("status", status);

    const response = await apiClient.get(`/api/Designs?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single design by ID
   * Returns design with ETag for concurrency control
   */
  async getDesign(id) {
    const response = await apiClient.get(`/api/Designs/${id}`);
    return {
      data: response.data,
      etag: response.headers.etag || response.headers.ETag,
    };
  },

  /**
   * Create new design
   */
  async createDesign(designData) {
    const response = await apiClient.post("/api/Designs", designData);
    return {
      data: response.data,
      etag: response.headers.etag || response.headers.ETag,
    };
  },

  /**
   * Update existing design with optimistic concurrency control
   * @param {number} id - Design ID
   * @param {object} updateData - Design update data
   * @param {string} etag - ETag from previous GET/PUT for concurrency control
   */
  async updateDesign(id, updateData, etag) {
    const response = await apiClient.put(`/api/Designs/${id}`, updateData, {
      headers: {
        "If-Match": etag,
      },
    });
    return {
      data: response.data,
      etag: response.headers.etag || response.headers.ETag,
    };
  },

  /**
   * Delete design (soft delete by default)
   */
  async deleteDesign(id, hard = false) {
    const params = hard ? "?hard=true" : "";
    await apiClient.delete(`/api/Designs/${id}${params}`);
  },

  /**
   * Autosave design (throttled update)
   */
  async autosaveDesign(id, designData, etag) {
    return this.updateDesign(id, designData, etag);
  },
};

export default designApi;
