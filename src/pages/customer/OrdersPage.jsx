import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  CreditCard,
} from "lucide-react";
import { getMyOrders, getOrderStatusLabel } from "../../services/orderApi";
import { createPaymentLink } from "../../services/paymentApi";
import { App } from "antd";

export default function OrdersPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("[OrdersPage] Fetching orders with filter:", statusFilter);
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const response = await getMyOrders(params);

      console.log("[OrdersPage] Response:", response);

      if (response.success && response.data) {
        console.log("[OrdersPage] Orders fetched:", response.data?.length || 0);
        setOrders(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách đơn hàng.");
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Đã xảy ra lỗi khi tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePayNow = async (orderId) => {
    try {
      const hide = message.loading("Đang tạo link thanh toán...", 0);
      const response = await createPaymentLink(orderId);

      if (response.success && response.checkoutUrl) {
        hide();
        message.success("Chuyển đến trang thanh toán");
        window.location.href = response.checkoutUrl;
      } else {
        hide();
        message.error(response.message || "Không thể tạo link thanh toán");
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Đã xảy ra lỗi khi tạo link thanh toán");
    }
  };

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
      order.address?.toLowerCase().includes(searchQuery.toLowerCase());

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
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="mt-2 text-gray-600">
            Quản lý và theo dõi các đơn hàng của bạn
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
            Chờ thanh toán ({statusCounts.Pending})
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
                ? "bg-gray-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Đã hủy ({statusCounts.Canceled})
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm p-8 text-center">
            <Package size={64} className="mx-auto text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Không thể tải đơn hàng
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Không tìm thấy đơn hàng phù hợp với từ khóa tìm kiếm"
                : statusFilter !== "all"
                ? "Bạn chưa có đơn hàng nào ở trạng thái này"
                : "Bạn chưa có đơn hàng nào"}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ giao hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        navigate(`/customer/orders/${order.orderId}`)
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.totalAmount || 0} sản phẩm
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {order.address && `${order.address}, `}
                          {order.ward && `${order.ward}, `}
                          {order.district && `${order.district}, `}
                          {order.province}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-emerald-600">
                          {formatCurrency(order.totalPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getStatusIcon(order.orderStatus)}
                          {getOrderStatusLabel(order.orderStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {order.orderStatus === "Pending" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePayNow(order.orderId);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs font-medium"
                            >
                              <CreditCard size={14} />
                              Thanh toán
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/customer/orders/${order.orderId}`);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            <Eye size={14} />
                            Chi tiết
                          </button>
                        </div>
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
}
