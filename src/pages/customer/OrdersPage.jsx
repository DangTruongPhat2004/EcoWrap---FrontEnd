import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { Package, ChevronRight, Filter, Search } from "lucide-react";
import {
  getMyOrders,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "../../services/orderApi";
import { fmtVND } from "../../utils/money";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [backendNotImplemented, setBackendNotImplemented] = useState(false);

  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const response = await getMyOrders(params);

      if (response.success) {
        setOrders(response.data || []);
        setBackendNotImplemented(false);
      } else {
        // Check if it's a backend implementation issue
        if (response.message?.includes("chưa được backend triển khai")) {
          setBackendNotImplemented(true);
        } else {
          toast.error(response.message || "Không thể tải danh sách đơn hàng");
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.response?.status === 501) {
        setBackendNotImplemented(true);
      } else {
        toast.error("Đã xảy ra lỗi khi tải đơn hàng");
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "Pending", label: "Chờ xác nhận" },
    { value: "Packaging", label: "Đang đóng gói" },
    { value: "Shipping", label: "Đang giao hàng" },
    { value: "Completed", label: "Hoàn thành" },
    { value: "Canceled", label: "Đã hủy" },
  ];

  return (
    <main className="bg-[#F6F7F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đơn hàng của tôi
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các đơn hàng của bạn
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Filter size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Trạng thái:
            </span>
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={statusFilter === option.value ? "solid" : "flat"}
                color={statusFilter === option.value ? "primary" : "default"}
                onPress={() => setStatusFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-gray-600">Đang tải đơn hàng...</p>
          </div>
        ) : backendNotImplemented ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm p-8 text-center">
            <div className="text-yellow-600 mb-4">
              <Package size={64} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chức năng đang được phát triển
            </h3>
            <p className="text-gray-600 mb-4">
              Backend chưa triển khai API endpoint để lấy danh sách đơn hàng.
            </p>
            <div className="bg-white rounded-lg p-4 text-left text-sm text-gray-700 mb-6 max-w-2xl mx-auto">
              <p className="font-semibold mb-2">Backend cần:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Implement{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    GetAllOrderAsync(userId)
                  </code>{" "}
                  trong OrderService
                </li>
                <li>
                  Uncomment endpoint{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    GET /api/order/my-orders
                  </code>{" "}
                  trong OrderController
                </li>
              </ul>
            </div>
            <Button color="primary" onPress={() => navigate("/products")}>
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-500 mb-6">
              Bạn chưa có đơn hàng nào{" "}
              {statusFilter !== "all" &&
                `ở trạng thái "${
                  statusOptions.find((o) => o.value === statusFilter)?.label
                }"`}
            </p>
            <Button color="primary" onPress={() => navigate("/products")}>
              Bắt đầu mua sắm
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.orderId}
                className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                isPressable
                onPress={() => handleViewOrder(order.orderId)}
              >
                <CardBody className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Đơn hàng #{order.orderId}
                        </h3>
                        <Chip
                          size="sm"
                          className={getOrderStatusColor(order.orderStatus)}
                        >
                          {getOrderStatusLabel(order.orderStatus)}
                        </Chip>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Ngày đặt:</span>{" "}
                          <span className="text-gray-800 font-medium">
                            {dayjs(order.createdDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Số lượng:</span>{" "}
                          <span className="text-gray-800 font-medium">
                            {order.totalAmount || 0} sản phẩm
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-500">
                            Địa chỉ giao hàng:
                          </span>{" "}
                          <span className="text-gray-800 font-medium">
                            {order.address}, {order.ward}, {order.district},{" "}
                            {order.province}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Total & Action */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          Tổng tiền
                        </div>
                        <div className="text-xl font-bold text-emerald-600">
                          {fmtVND(order.totalPrice)}
                        </div>
                      </div>
                      <ChevronRight
                        size={24}
                        className="text-gray-400 md:hidden"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
