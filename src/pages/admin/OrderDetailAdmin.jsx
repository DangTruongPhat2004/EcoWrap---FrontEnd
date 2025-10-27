import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Hash,
  AlertCircle,
} from "lucide-react";
import {
  getOrderById,
  confirmPackaging,
  confirmShipment,
  declineOrder,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "../../services/orderApi";
import toast from "react-hot-toast";

const OrderDetailAdmin = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getOrderById(orderId);

      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError(
          response.message ||
            "Không thể tải chi tiết đơn hàng. Backend cần implement GetOrderByIdAsync."
        );
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
      setError("Đã xảy ra lỗi khi tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPackaging = async () => {
    if (
      !window.confirm(
        "Xác nhận đơn hàng này đã thanh toán và bắt đầu đóng gói?"
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await confirmPackaging(orderId);

      if (response.success) {
        toast.success(
          "Đã xác nhận và chuyển đơn hàng sang trạng thái đóng gói!"
        );
        fetchOrderDetail(); // Reload order
      } else {
        toast.error(response.message || "Không thể xác nhận đơn hàng");
      }
    } catch (err) {
      console.error("Error confirming packaging:", err);
      toast.error("Đã xảy ra lỗi khi xác nhận đơn hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmShipment = async () => {
    if (
      !window.confirm("Xác nhận bàn giao đơn hàng cho đơn vị vận chuyển GHTK?")
    ) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await confirmShipment(orderId);

      if (response.success) {
        toast.success(
          "Đã tạo vận đơn GHTK và chuyển đơn hàng sang trạng thái giao hàng!"
        );
        fetchOrderDetail(); // Reload order
      } else {
        toast.error(response.message || "Không thể tạo vận đơn");
      }
    } catch (err) {
      console.error("Error confirming shipment:", err);
      toast.error("Đã xảy ra lỗi khi xác nhận giao hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineOrder = async () => {
    const reason = window.prompt(
      "Vui lòng nhập lý do từ chối đơn hàng (sẽ gửi email cho khách hàng):"
    );

    if (!reason || reason.trim() === "") {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setActionLoading(true);
    try {
      const response = await declineOrder(orderId);

      if (response.success) {
        toast.success(
          "Đã từ chối đơn hàng. Email thông báo sẽ được gửi cho khách hàng."
        );
        fetchOrderDetail(); // Reload order
      } else {
        toast.error(response.message || "Không thể từ chối đơn hàng");
      }
    } catch (err) {
      console.error("Error declining order:", err);
      toast.error("Đã xảy ra lỗi khi từ chối đơn hàng");
    } finally {
      setActionLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách đơn hàng
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Không thể tải đơn hàng
                </h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    );
  }

  const canConfirmPackaging = order.orderStatus === "Pending";
  const canConfirmShipment = order.orderStatus === "Packaging";
  const canDecline = ["Pending", "Packaging", "Shipping"].includes(
    order.orderStatus
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách đơn hàng
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng #{order.orderId}
              </h1>
              <p className="text-gray-600 mt-1">
                Tạo lúc: {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${getOrderStatusColor(
                order.orderStatus
              )}`}
            >
              {getOrderStatusLabel(order.orderStatus)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {(canConfirmPackaging || canConfirmShipment || canDecline) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thao tác quản lý
            </h2>
            <div className="flex flex-wrap gap-3">
              {canConfirmPackaging && (
                <button
                  onClick={handleConfirmPackaging}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Package size={18} />
                  {actionLoading
                    ? "Đang xử lý..."
                    : "Xác nhận thanh toán & Đóng gói"}
                </button>
              )}
              {canConfirmShipment && (
                <button
                  onClick={handleConfirmShipment}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Truck size={18} />
                  {actionLoading
                    ? "Đang xử lý..."
                    : "Xác nhận giao hàng (GHTK)"}
                </button>
              )}
              {canDecline && (
                <button
                  onClick={handleDeclineOrder}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={18} />
                  {actionLoading ? "Đang xử lý..." : "Từ chối / Hủy đơn"}
                </button>
              )}
            </div>
            {canConfirmPackaging && (
              <p className="mt-3 text-sm text-gray-600">
                ℹ️ Xác nhận thanh toán sẽ trừ tồn kho và chuyển trạng thái sang
                "Đang đóng gói"
              </p>
            )}
            {canConfirmShipment && (
              <p className="mt-3 text-sm text-gray-600">
                ℹ️ Xác nhận giao hàng sẽ tạo vận đơn GHTK và chuyển trạng thái
                sang "Đang giao hàng"
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} />
                Thông tin khách hàng
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Tên khách hàng</p>
                    <p className="font-medium">{order.customerName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">
                      {order.customerEmail || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">
                      {order.customerPhone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Địa chỉ giao hàng
              </h2>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress || "N/A"}</p>
                <p className="text-gray-600">
                  {[
                    order.shippingHamlet,
                    order.shippingWard,
                    order.shippingDistrict,
                    order.shippingProvince,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} />
                Sản phẩm ({order.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0"
                  >
                    {item.thumb && (
                      <img
                        src={item.thumb}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.desc && (
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Số lượng: {item.qty} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.qty * item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Shipping Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tổng quan đơn hàng
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số lượng</span>
                  <span className="font-medium">
                    {order.totalAmount || 0} sản phẩm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền hàng</span>
                  <span className="font-medium">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">
                      Tổng thanh toán
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {(order.transportUnit || order.shippingCode) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck size={20} />
                  Thông tin vận chuyển
                </h2>
                <div className="space-y-3">
                  {order.transportUnit && (
                    <div>
                      <p className="text-sm text-gray-500">Đơn vị vận chuyển</p>
                      <p className="font-medium">{order.transportUnit}</p>
                    </div>
                  )}
                  {order.shippingCode && (
                    <div>
                      <p className="text-sm text-gray-500">Mã vận đơn</p>
                      <p className="font-mono font-medium">
                        {order.shippingCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Lịch sử đơn hàng
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Đơn hàng được tạo
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Cập nhật trạng thái
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order ID */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Hash size={18} />
                <div>
                  <p className="text-sm font-medium">Mã đơn hàng</p>
                  <p className="font-mono font-semibold">#{order.orderId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailAdmin;
