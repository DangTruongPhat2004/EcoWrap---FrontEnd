import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Button, Chip, Avatar } from "@nextui-org/react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  Store,
  MessageCircle,
} from "lucide-react";
import {
  getMyOrderDetail,
  confirmDelivery,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "../../services/orderApi";
import { createPaymentLink } from "../../services/paymentApi";
import { fmtVND } from "../../utils/money";
import { App } from "antd";
import dayjs from "dayjs";

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
        items: [],
      };
    }

    acc[sellerId].items.push(item);
    return acc;
  }, {});

  return Object.values(grouped);
}

export default function OrderDetailPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const fetchOrderDetail = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyOrderDetail(orderId);

      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        message.error(response.message || "Không thể tải chi tiết đơn hàng");
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
      message.error("Đã xảy ra lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const handleConfirmDelivery = async () => {
    try {
      setConfirming(true);
      const response = await confirmDelivery(orderId);

      if (response.success) {
        message.success("Đã xác nhận nhận hàng thành công!");
        fetchOrderDetail(); // Reload order data
      } else {
        message.error(response.message || "Không thể xác nhận nhận hàng");
      }
    } catch (err) {
      console.error("Error confirming delivery:", err);
      message.error("Đã xảy ra lỗi khi xác nhận nhận hàng");
    } finally {
      setConfirming(false);
    }
  };

  const handlePayNow = async () => {
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

  if (loading) {
    return (
      <main className="bg-[#F6F7F3] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-gray-600">Đang tải chi tiết đơn hàng...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="bg-[#F6F7F3] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">Không tìm thấy đơn hàng</p>
            <Button
              color="primary"
              onPress={() => navigate("/customer/orders")}
            >
              Quay lại danh sách đơn hàng
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const canConfirmDelivery = order.orderStatus === "Shipping";
  const canPayNow = order.orderStatus === "Pending";

  return (
    <main className="bg-[#F6F7F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="light"
          startContent={<ArrowLeft size={20} />}
          onPress={() => navigate("/customer/orders")}
          className="mb-4"
        >
          Quay lại danh sách đơn hàng
        </Button>
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Đơn hàng #{order.orderId}
            </h1>
            <div className="flex items-center gap-3">
              <Chip className={getOrderStatusColor(order.orderStatus)}>
                {getOrderStatusLabel(order.orderStatus)}
              </Chip>
              <span className="text-sm text-gray-600">
                Đặt ngày {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {canPayNow && (
              <Button
                color="warning"
                size="lg"
                startContent={<CreditCard size={20} />}
                onPress={handlePayNow}
                className="font-medium"
              >
                Thanh toán ngay
              </Button>
            )}
            {canConfirmDelivery && (
              <Button
                color="success"
                size="lg"
                startContent={<CheckCircle2 size={20} />}
                onPress={handleConfirmDelivery}
                isLoading={confirming}
              >
                Xác nhận đã nhận hàng
              </Button>
            )}
          </div>
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group items by seller */}
            {groupItemsBySeller(order.items).map((sellerGroup, idx) => (
              <Card key={idx} className="border border-gray-200">
                <CardBody className="p-0">
                  {/* Seller Header */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Clickable Seller Avatar */}
                      <button
                        onClick={() =>
                          sellerGroup.sellerId &&
                          navigate(`/store/${sellerGroup.sellerId}`)
                        }
                        className="hover:opacity-80 transition-opacity"
                      >
                        <Avatar
                          size="sm"
                          name={sellerGroup.sellerName || "S"}
                          classNames={{
                            base: "bg-emerald-100",
                            name: "text-emerald-700 font-semibold",
                          }}
                        />
                      </button>

                      {/* Clickable Seller Name */}
                      <button
                        onClick={() =>
                          sellerGroup.sellerId &&
                          navigate(`/store/${sellerGroup.sellerId}`)
                        }
                        className="font-semibold text-gray-800 hover:text-emerald-600 hover:underline cursor-pointer transition-colors"
                      >
                        {sellerGroup.sellerName || "Nhà bán hàng"}
                      </button>

                      <Button
                        size="sm"
                        variant="bordered"
                        startContent={<MessageCircle size={14} />}
                        className="text-xs"
                      >
                        Chat
                      </Button>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-6 space-y-4">
                    {sellerGroup.items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                      >
                        {/* Product Image */}
                        {item.thumb && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.thumb}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                            {item.name || "Sản phẩm"}
                          </h3>
                          {item.desc && (
                            <p className="text-sm text-gray-500 mb-2">
                              {item.desc}
                            </p>
                          )}
                          {item.designFile && (
                            <div className="text-xs text-emerald-600 mb-2">
                              ✓ Có thiết kế tùy chỉnh
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">x{item.qty}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm text-gray-400 line-through mb-1">
                            {/* Could show original price here if available */}
                          </div>
                          <div className="text-gray-800 font-medium mb-1">
                            {fmtVND(item.price)}
                          </div>
                          <div className="text-emerald-600 font-semibold">
                            {fmtVND(item.price * item.qty)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Seller Total */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end items-center gap-4">
                      <span className="text-gray-600">
                        Tổng ({sellerGroup.items.length} sản phẩm):
                      </span>
                      <span className="text-xl font-bold text-emerald-600">
                        {fmtVND(
                          sellerGroup.items.reduce(
                            (sum, item) => sum + item.price * item.qty,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* Order Summary */}
            <Card className="border border-gray-200">
              <CardBody className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({order.totalAmount} sản phẩm):</span>
                    <span>{fmtVND(order.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="text-emerald-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t-2 border-gray-200">
                    <span>Tổng cộng:</span>
                    <span className="text-emerald-600">
                      {fmtVND(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Order Timeline */}
            <Card className="border border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <Clock size={20} className="text-emerald-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Lịch sử đơn hàng
                  </h2>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Timeline items based on status */}
                  <TimelineItem
                    icon={CheckCircle2}
                    title="Đơn hàng đã được tạo"
                    time={dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                    completed
                  />
                  {order.orderStatus !== "Pending" && (
                    <TimelineItem
                      icon={Package}
                      title="Đơn hàng đang được đóng gói"
                      time={
                        order.updatedAt
                          ? dayjs(order.updatedAt).format("DD/MM/YYYY HH:mm")
                          : ""
                      }
                      completed={[
                        "Packaging",
                        "Shipping",
                        "Completed",
                      ].includes(order.orderStatus)}
                    />
                  )}
                  {["Shipping", "Completed"].includes(order.orderStatus) && (
                    <TimelineItem
                      icon={Truck}
                      title="Đơn hàng đang được vận chuyển"
                      time={
                        order.shippingCode
                          ? `Mã vận đơn: ${order.shippingCode}`
                          : ""
                      }
                      completed={order.orderStatus === "Completed"}
                    />
                  )}
                  {order.orderStatus === "Completed" && (
                    <TimelineItem
                      icon={CheckCircle2}
                      title="Giao hàng thành công"
                      time={
                        order.updatedAt
                          ? dayjs(order.updatedAt).format("DD/MM/YYYY HH:mm")
                          : ""
                      }
                      completed
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <Card className="border border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <MapPin size={20} className="text-emerald-600" />
                  <h3 className="font-semibold text-gray-800">
                    Thông tin giao hàng
                  </h3>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Người nhận</div>
                    <div className="font-medium text-gray-800">
                      {order.customerName || "Khách hàng"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Số điện thoại
                    </div>
                    <div className="font-medium text-gray-800">
                      {order.customerPhone || "Chưa cập nhật"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Địa chỉ giao hàng
                    </div>
                    <div className="font-medium text-gray-800">
                      {order.shippingAddress}
                      <br />
                      {order.shippingWard}, {order.shippingDistrict}
                      <br />
                      {order.shippingProvince}
                    </div>
                  </div>

                  {order.shippingCode && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Mã vận đơn
                      </div>
                      <div className="font-mono font-medium text-gray-800">
                        {order.shippingCode}
                      </div>
                    </div>
                  )}

                  {order.transportUnit && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Đơn vị vận chuyển
                      </div>
                      <div className="font-medium text-gray-800">
                        {order.transportUnit}
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

// Timeline Item Component
function TimelineItem({ icon, title, time, completed }) {
  const IconComponent = icon;
  return (
    <div className="flex gap-4">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          completed ? "bg-emerald-100" : "bg-gray-100"
        }`}
      >
        <IconComponent
          size={20}
          className={completed ? "text-emerald-600" : "text-gray-400"}
        />
      </div>
      <div className="flex-1">
        <h4
          className={`font-semibold ${
            completed ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {title}
        </h4>
        {time && <p className="text-sm text-gray-500 mt-1">{time}</p>}
      </div>
    </div>
  );
}
