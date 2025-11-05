import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Package,
  BarChart3,
  Leaf,
  TrendingUp,
  Recycle,
  Droplets,
  Warehouse,
  AlertTriangle,
} from "lucide-react";
import { getMyProducts } from "../../services/productApi";
import inventoryApi from "../../services/inventoryApi";
import warehouseApi from "../../services/warehouseApi";
import { getMySellerInfo } from "../../services/sellerApi";

const VendorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    products: [],
    inventory: [],
    warehouses: [],
    sellerInfo: null,
  });

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsData, inventoryData, warehousesData, sellerData] =
          await Promise.all([
            getMyProducts(),
            inventoryApi.getMyInventory(),
            warehouseApi.getMyWarehouses(),
            getMySellerInfo().catch(() => null), // Optional
          ]);

        setDashboardData({
          products: productsData || [],
          inventory: inventoryData || [],
          warehouses: warehousesData || [],
          sellerInfo: sellerData?.data || sellerData || null,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalProducts = dashboardData.products.length;
    const totalStock = dashboardData.inventory.reduce(
      (sum, item) => sum + (item.stockQuantity || 0),
      0
    );
    const totalWarehouses = dashboardData.warehouses.length;
    const lowStockItems = dashboardData.inventory.filter(
      (item) => item.stockQuantity < 20
    ).length;

    // Calculate total value of inventory (approximate)
    const inventoryValue = dashboardData.inventory.reduce((sum, item) => {
      const product = dashboardData.products.find(
        (p) => p.productId === item.productId
      );
      return sum + (product?.productPrice || 0) * (item.stockQuantity || 0);
    }, 0);

    return [
      {
        title: "Tổng Giá Trị Kho",
        value: `₫${inventoryValue.toLocaleString()}`,
        change: `${totalProducts} sản phẩm`,
        icon: DollarSign,
        trend: "up",
      },
      {
        title: "Tổng Tồn Kho",
        value: totalStock.toLocaleString(),
        change: `${totalProducts} loại sản phẩm`,
        icon: Package,
        trend: "up",
      },
      {
        title: "Kho Hàng",
        value: totalWarehouses.toString(),
        change: `${lowStockItems} sản phẩm sắp hết`,
        icon: Warehouse,
        trend: lowStockItems > 0 ? "warning" : "up",
      },
      {
        title: "Tác Động Xanh",
        value: `${totalProducts} sản phẩm`,
        change: "Thân thiện môi trường",
        icon: Leaf,
        trend: "eco",
      },
    ];
  }, [dashboardData]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-red-600">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p className="text-lg mb-4">{error}</p>
      </div>
    );
  }

  const sellerName = dashboardData.sellerInfo?.companyName || "Vendor";

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Chào mừng trở lại, {sellerName}! 👋
        </h1>
        <p className="text-emerald-100">
          Theo dõi hiệu suất bán hàng và tác động môi trường của bạn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-sm mt-1 ${
                    stat.trend === "up"
                      ? "text-emerald-600"
                      : stat.trend === "eco"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inventory Updates */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tồn Kho Gần Đây
          </h3>
          <div className="space-y-3">
            {dashboardData.inventory.slice(0, 5).map((item) => {
              const product = dashboardData.products.find(
                (p) => p.productId === item.productId
              );
              const isLowStock = item.stockQuantity < 20;

              return (
                <div
                  key={item.inventoryId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 ${
                        isLowStock ? "bg-orange-100" : "bg-emerald-100"
                      } rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`text-sm ${
                          isLowStock ? "text-orange-600" : "text-emerald-600"
                        }`}
                      >
                        📦
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product?.productName || `Sản phẩm ${item.productId}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.warehouse?.warehouseName || "Kho hàng"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        isLowStock ? "text-orange-600" : "text-gray-900"
                      }`}
                    >
                      {item.stockQuantity} sản phẩm
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.lastUpdated).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              );
            })}
            {dashboardData.inventory.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Chưa có dữ liệu tồn kho
              </p>
            )}
          </div>
        </div>

        {/* Business Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tổng Quan Kinh Doanh
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sản phẩm đang bán</p>
                  <p className="text-sm text-gray-600">
                    {dashboardData.products.length} sản phẩm
                  </p>
                </div>
              </div>
              <div className="text-emerald-600 font-semibold">
                {
                  dashboardData.products.filter(
                    (p) => p.productStatus === "Active"
                  ).length
                }{" "}
                Hoạt động
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Warehouse className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Kho hàng</p>
                  <p className="text-sm text-gray-600">
                    {dashboardData.warehouses.length} địa điểm
                  </p>
                </div>
              </div>
              <div className="text-blue-600 font-semibold">
                {dashboardData.inventory.length} mục tồn kho
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Sản phẩm thân thiện môi trường
                  </p>
                  <p className="text-sm text-gray-600">100% sản phẩm xanh</p>
                </div>
              </div>
              <div className="text-green-600 font-semibold">Ưu việt</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông Tin Cửa Hàng
        </h3>
        {dashboardData.sellerInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Tên công ty</p>
              <p className="font-medium text-gray-900">
                {dashboardData.sellerInfo.companyName}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
              <p className="font-medium text-gray-900">
                {dashboardData.sellerInfo.address}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Ngân hàng</p>
              <p className="font-medium text-gray-900">
                {dashboardData.sellerInfo.bankName || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
