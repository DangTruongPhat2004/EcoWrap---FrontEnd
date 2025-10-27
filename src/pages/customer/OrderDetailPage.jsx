import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import {
  getOrderById,
  confirmDelivery,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "../../services/orderApi";
import { fmtVND } from "../../utils/money";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const fetchOrderDetail = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrderById(orderId);

      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        toast.error(response.message || "Không thể tải chi tiết đơn hàng");
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
      toast.error("Đã xảy ra lỗi khi tải đơn hàng");
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
        toast.success("Đã xác nhận nhận hàng thành công!");
        fetchOrderDetail(); // Reload order data
      } else {
        toast.error(response.message || "Không thể xác nhận nhận hàng");
      }
    } catch (err) {
      console.error("Error confirming delivery:", err);
      toast.error("Đã xảy ra lỗi khi xác nhận nhận hàng");
    } finally {
      setConfirming(false);
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
                Đặt ngày {dayjs(order.createdDate).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="border border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <Package size={20} className="text-emerald-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Chi tiết sản phẩm
                  </h2>
                </div>

                <div className="mt-6 space-y-4">
                  {order.cartItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      {item.product?.productImages?.[0] && (
                        <img
                          src={item.product.productImages[0]}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.productName || "Sản phẩm"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.product?.productDescription || ""}
                        </p>
                        <div className="text-sm text-gray-600 mt-1">
                          Số lượng: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          Đơn giá
                        </div>
                        <div className="font-medium text-gray-800">
                          {fmtVND(item.cartItemPrice / item.quantity)}
                        </div>
                        <div className="text-sm text-emerald-600 font-semibold mt-1">
                          {fmtVND(item.cartItemPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính ({order.totalAmount} sản phẩm):</span>
                      <span>{fmtVND(order.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span>Đang tính toán</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-200">
                      <span>Tổng cộng:</span>
                      <span className="text-emerald-600">
                        {fmtVND(order.totalPrice)}
                      </span>
                    </div>
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
                    time={dayjs(order.createdDate).format("DD/MM/YYYY HH:mm")}
                    completed
                  />
                  {order.orderStatus !== "Pending" && (
                    <TimelineItem
                      icon={Package}
                      title="Đơn hàng đang được đóng gói"
                      time={
                        order.updatedDate
                          ? dayjs(order.updatedDate).format("DD/MM/YYYY HH:mm")
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
                        order.updatedDate
                          ? dayjs(order.updatedDate).format("DD/MM/YYYY HH:mm")
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
                      {order.customer?.user?.fullName || "Khách hàng"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Số điện thoại
                    </div>
                    <div className="font-medium text-gray-800">
                      {order.customer?.user?.phoneNumber || "Chưa cập nhật"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Địa chỉ giao hàng
                    </div>
                    <div className="font-medium text-gray-800">
                      {order.address}
                      <br />
                      {order.ward}, {order.district}
                      <br />
                      {order.province}
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
