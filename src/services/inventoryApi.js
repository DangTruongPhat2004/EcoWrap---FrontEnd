import apiClient from "./apiClient";

const inventoryApi = {
  /**
   * Lấy danh sách tồn kho của seller hiện tại.
   * @param {Object} params - Các tham số truy vấn (ví dụ: productId, warehouseId).
   * @returns {Promise<Array>} Danh sách các mục tồn kho.
   * Kỳ vọng BE trả về: [{ inventoryId, productId, productName, warehouseId, warehouseName, quantity, lastUpdated }]
   */
  getMyInventory: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/Inventory/my", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một mục tồn kho.
   * @param {number} inventoryId - ID của mục tồn kho.
   * @returns {Promise<Object>} Chi tiết mục tồn kho.
   */
  getInventoryById: async (inventoryId) => {
    try {
      const response = await apiClient.get(`/api/Inventory/${inventoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory item ${inventoryId}:`, error);
      throw error;
    }
  },

  /**
   * Thêm sản phẩm vào kho (tạo mục tồn kho mới).
   * @param {Object} inventoryData - Dữ liệu tồn kho mới.
   * Ví dụ: { productId: "string", warehouseId: number, quantity: number }
   * @returns {Promise<Object>} Mục tồn kho vừa được tạo.
   */
  addInventory: async (inventoryData) => {
    try {
      const response = await apiClient.post("/api/Inventory", inventoryData);
      return response.data;
    } catch (error) {
      console.error("Error adding inventory:", error);
      throw error;
    }
  },

  /**
   * Cập nhật số lượng tồn kho.
   * @param {number} inventoryId - ID của mục tồn kho cần cập nhật.
   * @param {Object} updateData - Dữ liệu cập nhật.
   * Ví dụ: { quantity: number }
   * @returns {Promise<Object>} Mục tồn kho đã được cập nhật.
   */
  updateInventory: async (inventoryId, updateData) => {
    try {
      const response = await apiClient.put(
        `/api/Inventory/update/${inventoryId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating inventory ${inventoryId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa một mục tồn kho.
   * @param {number} inventoryId - ID của mục tồn kho cần xóa.
   * @returns {Promise<any>}
   */
  deleteInventory: async (inventoryId) => {
    try {
      const response = await apiClient.delete(`/api/Inventory/${inventoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting inventory ${inventoryId}:`, error);
      throw error;
    }
  },
};

export default inventoryApi;
