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
  CreditCard,
  Building2,
  Copy,
  X,
} from "lucide-react";
import {
  getOrderByIdAdmin,
  confirmPackaging,
  confirmShipment,
  declineOrder,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "../../services/orderApi";
import { App } from "antd";
import { messageHelper } from "../../utils/messageHelper";

const OrderDetailAdmin = () => {
  const { message } = App.useApp();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getOrderByIdAdmin(orderId);

      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError(
          response.message ||
            "Không thể tải chi tiết đơn hàng. Backend cần implement GetOrderByIdForAdminAsync."
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
        messageHelper.success(
          message,
          "Đã xác nhận và chuyển đơn hàng sang trạng thái đóng gói!"
        );
        fetchOrderDetail(); // Reload order
      } else {
        messageHelper.error(
          message,
          response.message || "Không thể xác nhận đơn hàng"
        );
      }
    } catch (err) {
      console.error("Error confirming packaging:", err);
      messageHelper.error(message, "Đã xảy ra lỗi khi xác nhận đơn hàng");
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
        messageHelper.success(
          message,
          "Đã tạo vận đơn GHTK và chuyển đơn hàng sang trạng thái giao hàng!"
        );
        fetchOrderDetail(); // Reload order
      } else {
        messageHelper.error(
          message,
          response.message || "Không thể tạo vận đơn"
        );
      }
    } catch (err) {
      console.error("Error confirming shipment:", err);
      messageHelper.error(message, "Đã xảy ra lỗi khi xác nhận giao hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineOrder = async () => {
    const reason = window.prompt(
      "Vui lòng nhập lý do từ chối đơn hàng (sẽ gửi email cho khách hàng):"
    );

    if (!reason || reason.trim() === "") {
      messageHelper.error(message, "Vui lòng nhập lý do từ chối");
      return;
    }

    setActionLoading(true);
    try {
      const response = await declineOrder(orderId);

      if (response.success) {
        messageHelper.success(
          message,
          "Đã từ chối đơn hàng. Email thông báo sẽ được gửi cho khách hàng."
        );
        fetchOrderDetail(); // Reload order
      } else {
        messageHelper.error(
          message,
          response.message || "Không thể từ chối đơn hàng"
        );
      }
    } catch (err) {
      console.error("Error declining order:", err);
      messageHelper.error(message, "Đã xảy ra lỗi khi từ chối đơn hàng");
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

            {/* Order Items - Grouped by Seller */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} />
                Sản phẩm ({order.items?.length || 0})
              </h2>
              <div className="space-y-6">
                {groupItemsBySeller(order.items).map((sellerGroup, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Seller Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {sellerGroup.sellerName || "Nhà bán hàng"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSeller(sellerGroup);
                          setShowBankModal(true);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <CreditCard size={16} />
                        Thông tin thanh toán
                      </button>
                    </div>

                    {/* Seller Items */}
                    <div className="p-4 space-y-3">
                      {sellerGroup.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-b-0"
                        >
                          {item.thumb && (
                            <img
                              src={item.thumb}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {item.name}
                            </h3>
                            {item.desc && (
                              <p className="text-sm text-gray-500">
                                {item.desc}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              Số lượng: {item.qty} ×{" "}
                              {formatCurrency(item.price)}
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

                    {/* Seller Total */}
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
                      <div className="text-right">
                        <span className="text-sm text-gray-600 mr-3">
                          Tổng cộng:
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(
                            sellerGroup.items.reduce(
                              (sum, item) => sum + item.price * item.qty,
                              0
                            )
                          )}
                        </span>
                      </div>
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

        {/* Bank Info Modal */}
        {showBankModal && selectedSeller && (
          <BankInfoModal
            seller={selectedSeller}
            onClose={() => {
              setShowBankModal(false);
              setSelectedSeller(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Helper function to group items by seller
function groupItemsBySeller(items) {
  if (!items || items.length === 0) return [];

  const grouped = items.reduce((acc, item) => {
    const sellerId = item.sellerId || "unknown";
    const sellerName = item.sellerName || "Nhà bán hàng";

    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerId,
        sellerName,
        bankAccountNumber: item.bankAccountNumber,
        bankName: item.bankName,
        accountHolderName: item.accountHolderName,
        bankBranch: item.bankBranch,
        qrcodeImage: item.qrcodeImage,
        email: item.sellerEmail,
        phone: item.sellerPhone,
        items: [],
      };
    }

    acc[sellerId].items.push(item);
    return acc;
  }, {});

  return Object.values(grouped);
}

// Bank Info Modal Component
function BankInfoModal({ seller, onClose }) {
  const { message } = App.useApp();
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    messageHelper.success(message, "Đã sao chép!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Thông tin thanh toán
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {seller.sellerName || "Nhà bán hàng"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* QR Code */}
          {seller.qrcodeImage && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                <img
                  src={seller.qrcodeImage}
                  alt="QR Code thanh toán"
                  className="w-64 h-64 object-contain"
                />
                <p className="text-center text-sm text-gray-600 mt-2">
                  Quét mã để thanh toán
                </p>
              </div>
            </div>
          )}

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" />
              Chi tiết tài khoản ngân hàng
            </h3>

            {seller.bankName && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                    <p className="font-semibold text-gray-900">
                      {seller.bankName}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {seller.accountHolderName && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Chủ tài khoản</p>
                    <p className="font-semibold text-gray-900">
                      {seller.accountHolderName}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(seller.accountHolderName)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Sao chép"
                  >
                    <Copy size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            {seller.bankAccountNumber && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Số tài khoản</p>
                    <p className="font-mono font-semibold text-gray-900 text-lg">
                      {seller.bankAccountNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(seller.bankAccountNumber)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Sao chép"
                  >
                    <Copy size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            {seller.bankBranch && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Chi nhánh</p>
                    <p className="font-semibold text-gray-900">
                      {seller.bankBranch}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Info */}
            {(seller.email || seller.phone) && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Thông tin liên hệ
                </h4>
                <div className="space-y-2">
                  {seller.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-gray-500" />
                      <span className="text-gray-700">{seller.email}</span>
                    </div>
                  )}
                  {seller.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-gray-700">{seller.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Total for this Seller */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  Tổng tiền cần chuyển:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    seller.items.reduce(
                      (sum, item) => sum + item.price * item.qty,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailAdmin;
