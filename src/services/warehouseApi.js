import apiClient from "./apiClient";

const warehouseApi = {
  // Lấy danh sách tất cả kho hàng của vendor
  getWarehouses: async (params = {}) => {
    try {
      const response = await apiClient.get("/api/Inventory/my", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết một kho hàng
  getWarehouseById: async (warehouseId) => {
    try {
      const response = await apiClient.get(`/api/Warehouse/${warehouseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching warehouse:", error);
      throw error;
    }
  },

  // Tạo kho hàng mới
  createWarehouse: async (warehouseData) => {
    try {
      const response = await apiClient.post("/api/Warehouse", warehouseData);
      return response.data;
    } catch (error) {
      console.error("Error creating warehouse:", error);
      throw error;
    }
  },

  // Cập nhật thông tin kho hàng
  updateWarehouse: async (warehouseId, warehouseData) => {
    try {
      const response = await apiClient.put(
        `/api/Warehouse/${warehouseId}`,
        warehouseData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating warehouse:", error);
      throw error;
    }
  },

  // Xóa kho hàng
  deleteWarehouse: async (warehouseId) => {
    try {
      const response = await apiClient.delete(`/api/Warehouse/${warehouseId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      throw error;
    }
  },

  // Tìm kiếm kho hàng
  searchWarehouses: async (searchTerm, filters = {}) => {
    try {
      const params = {
        search: searchTerm,
        ...filters,
      };
      const response = await apiClient.get("/api/Warehouse/search", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching warehouses:", error);
      throw error;
    }
  },

  // Lấy báo cáo kho hàng
  getWarehouseReport: async (reportType = "summary", dateRange = {}) => {
    try {
      const params = {
        type: reportType,
        ...dateRange,
      };
      const response = await apiClient.get("/api/Warehouse/report", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching warehouse report:", error);
      throw error;
    }
  },

  // Tải xuống báo cáo kho hàng
  downloadWarehouseReport: async (reportType = "excel", dateRange = {}) => {
    try {
      const params = {
        format: reportType,
        ...dateRange,
      };
      const response = await apiClient.get("/api/Warehouse/report/download", {
        params,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error downloading warehouse report:", error);
      throw error;
    }
  },

  // Cập nhật trạng thái kho hàng
  updateWarehouseStatus: async (warehouseId, status) => {
    try {
      const response = await apiClient.patch(
        `/api/Warehouse/${warehouseId}/status`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating warehouse status:", error);
      throw error;
    }
  },

  // Lấy thống kê tổng quan kho hàng
  getWarehouseStats: async () => {
    try {
      const response = await apiClient.get("/api/Warehouse/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching warehouse stats:", error);
      throw error;
    }
  },
};

export default warehouseApi;
