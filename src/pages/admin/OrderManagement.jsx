import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import {
  getMyOrders,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "../../services/orderApi";

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      // Note: Backend needs to implement admin endpoint to get ALL orders
      // For now, using the user endpoint (will show 501 error if not implemented)
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const response = await getMyOrders(params);

      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError(
          response.message ||
            "Không thể tải danh sách đơn hàng. Backend cần implement endpoint admin."
        );
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Đã xảy ra lỗi khi tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "Packaging":
        return <Package size={16} className="text-blue-600" />;
      case "Shipping":
        return <Truck size={16} className="text-purple-600" />;
      case "Completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Canceled":
      case "Declined":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId?.toString().includes(searchQuery) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    Pending: orders.filter((o) => o.orderStatus === "Pending").length,
    Packaging: orders.filter((o) => o.orderStatus === "Packaging").length,
    Shipping: orders.filter((o) => o.orderStatus === "Shipping").length,
    Completed: orders.filter((o) => o.orderStatus === "Completed").length,
    Canceled: orders.filter((o) => o.orderStatus === "Canceled").length,
    Declined: orders.filter((o) => o.orderStatus === "Declined").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="mt-2 text-gray-600">
            Xem và quản lý tất cả đơn hàng trên hệ thống
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Tất cả ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter("Pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "Pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Chờ xác nhận ({statusCounts.Pending})
          </button>
          <button
            onClick={() => setStatusFilter("Packaging")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "Packaging"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Đang đóng gói ({statusCounts.Packaging})
          </button>
          <button
            onClick={() => setStatusFilter("Shipping")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "Shipping"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Đang giao ({statusCounts.Shipping})
          </button>
          <button
            onClick={() => setStatusFilter("Completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "Completed"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Hoàn thành ({statusCounts.Completed})
          </button>
          <button
            onClick={() => setStatusFilter("Canceled")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "Canceled"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Đã hủy ({statusCounts.Canceled})
          </button>
          <button
            onClick={() => setStatusFilter("Declined")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "Declined"
                ? "bg-gray-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Từ chối ({statusCounts.Declined})
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <p className="text-sm text-red-600 mt-1">
              Backend cần implement endpoint GET /api/admin/orders để hiển thị
              tất cả đơn hàng.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {searchQuery
                ? "Không tìm thấy đơn hàng nào phù hợp"
                : "Chưa có đơn hàng nào"}
            </p>
          </div>
        ) : (
          /* Orders Table */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.customerName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerEmail || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.totalAmount || 0} sản phẩm
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          {getOrderStatusLabel(order.orderStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/orders/${order.orderId}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
