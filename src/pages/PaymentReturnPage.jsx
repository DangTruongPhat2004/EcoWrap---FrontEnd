import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Truck,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Button, Card, CardBody, Divider, Chip } from "@nextui-org/react";

/**
 * Payment Return Page
 * This page handles the return from PayOS payment gateway
 * PayOS will redirect here with query parameters indicating payment status
 */
export default function PaymentReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing"); // processing, success, cancelled, failed
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // PayOS returns with these parameters:
    // - code: Payment status code ("00" = success)
    // - id: Transaction ID
    // - orderCode: Your order code (format: {orderId}{MMddHHmmss} - e.g., 181028102450)
    // - cancel: "true" if payment was cancelled, "false" otherwise
    // - status: "PAID" or other status

    const code = searchParams.get("code");
    const cancel = searchParams.get("cancel");
    const payosStatus = searchParams.get("status"); // PayOS status
    const orderCodeFromPayOS = searchParams.get("orderCode"); // Full orderCode with timestamp

    // Extract orderId from orderCode (remove last 10 digits timestamp: MMddHHmmss)
    let orderId = null;
    if (orderCodeFromPayOS) {
      const orderCodeStr = orderCodeFromPayOS.toString();
      if (orderCodeStr.length > 10) {
        // Extract orderId by removing timestamp suffix
        orderId = orderCodeStr.slice(0, -10);
      } else {
        orderId = orderCodeStr; // Fallback if format is different
      }
    }

    // Determine payment status based on PayOS response
    // Check multiple indicators: cancel flag, code, and status
    if (cancel === "true") {
      setStatus("cancelled");
      // Trigger animation after a brief delay
      setTimeout(() => setAnimate(true), 100);
    } else if (code === "00" || payosStatus === "PAID") {
      // Code "00" or status "PAID" means success
      setStatus("success");
      // Trigger animation after a brief delay
      setTimeout(() => setAnimate(true), 100);
    } else if (code && code !== "00") {
      setStatus("failed");
      // Trigger animation after a brief delay
      setTimeout(() => setAnimate(true), 100);
    } else {
      // No clear status, show processing
      setStatus("processing");
    }

    // Store order ID for navigation
    if (orderId) {
      sessionStorage.setItem("lastOrderId", orderId);
    }

    // Log for debugging
    console.log("PayOS Return:", {
      code,
      cancel,
      orderCodeFromPayOS,
      extractedOrderId: orderId,
    });
  }, [searchParams]);

  const handleViewOrder = () => {
    const orderCodeFromPayOS = searchParams.get("orderCode");
    let orderId = null;

    if (orderCodeFromPayOS) {
      const orderCodeStr = orderCodeFromPayOS.toString();
      orderId =
        orderCodeStr.length > 10 ? orderCodeStr.slice(0, -10) : orderCodeStr;
    }

    if (!orderId) {
      orderId = sessionStorage.getItem("lastOrderId");
    }

    if (orderId) {
      navigate(`/customer/orders/${orderId}`);
    } else {
      navigate("/customer/orders");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <Loader2 size={64} className="text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Đang xử lý thanh toán...
          </h1>
          <p className="text-gray-600">
            Vui lòng đợi trong giây lát. Chúng tôi đang xác nhận thanh toán của
            bạn.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <Card className="shadow-xl border-none">
            <CardBody className="p-8 md:p-12">
              {/* Animated Success Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className={`relative transition-all duration-500 ${
                    animate ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2
                      size={56}
                      className="text-white animate-bounce-once"
                      strokeWidth={3}
                    />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  Thanh toán thành công! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  Cảm ơn bạn đã tin tưởng EcoWrap
                </p>
                <p className="text-gray-500">
                  Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến tay
                  bạn
                </p>
              </div>

              {/* Order Info */}
              {searchParams.get("orderCode") && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Mã đơn hàng</span>
                    <Chip color="success" variant="flat" size="sm">
                      {searchParams.get("orderCode").slice(0, -10)}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái</span>
                    <Chip color="success" variant="dot" size="sm">
                      Đã thanh toán
                    </Chip>
                  </div>
                </div>
              )}

              <Divider className="my-6" />

              {/* Next Steps */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Package size={20} className="text-emerald-600" />
                  Các bước tiếp theo
                </h3>
                <div className="space-y-3 ml-7">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-emerald-700">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Xác nhận đơn hàng
                      </p>
                      <p className="text-xs text-gray-500">
                        Chúng tôi đang xác nhận và chuẩn bị đơn hàng
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-emerald-700">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Đóng gói & vận chuyển
                      </p>
                      <p className="text-xs text-gray-500">
                        Sản phẩm sẽ được đóng gói cẩn thận và giao đến bạn
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-emerald-700">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Nhận hàng & đánh giá
                      </p>
                      <p className="text-xs text-gray-500">
                        Kiểm tra sản phẩm và chia sẻ trải nghiệm của bạn
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full font-semibold"
                  onPress={handleViewOrder}
                  endContent={<ArrowRight size={20} />}
                >
                  Xem chi tiết đơn hàng
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="bordered"
                    size="lg"
                    className="font-medium"
                    onPress={handleContinueShopping}
                    startContent={<ShoppingBag size={18} />}
                  >
                    Mua tiếp
                  </Button>
                  <Button
                    variant="light"
                    size="lg"
                    className="font-medium"
                    onPress={handleBackToHome}
                  >
                    Về trang chủ
                  </Button>
                </div>
              </div>

              {/* Eco Message */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                  <Truck size={16} className="text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium">
                    Giao hàng xanh - Giảm thiểu carbon footprint
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <Card className="shadow-xl border-none">
            <CardBody className="p-8 md:p-12">
              {/* Cancelled Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className={`relative transition-all duration-500 ${
                    animate ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-gray-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full flex items-center justify-center shadow-lg">
                    <XCircle
                      size={56}
                      className="text-white animate-bounce-once"
                      strokeWidth={3}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  Thanh toán đã bị hủy
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  Bạn đã hủy thanh toán
                </p>
                <p className="text-gray-500">
                  Đơn hàng của bạn vẫn được lưu và đang chờ thanh toán
                </p>
              </div>

              {/* Order Info */}
              {searchParams.get("orderCode") && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Mã đơn hàng</span>
                    <Chip color="default" variant="flat" size="sm">
                      {searchParams.get("orderCode").slice(0, -10)}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái</span>
                    <Chip color="warning" variant="dot" size="sm">
                      Chờ thanh toán
                    </Chip>
                  </div>
                </div>
              )}

              <Divider className="my-6" />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full font-semibold"
                  onPress={handleViewOrder}
                  endContent={<ArrowRight size={20} />}
                >
                  Xem đơn hàng & Thanh toán lại
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="bordered"
                    size="lg"
                    className="font-medium"
                    onPress={handleContinueShopping}
                    startContent={<ShoppingBag size={18} />}
                  >
                    Tiếp tục mua
                  </Button>
                  <Button
                    variant="light"
                    size="lg"
                    className="font-medium"
                    onPress={handleBackToHome}
                  >
                    Về trang chủ
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // Failed status
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl border-none">
          <CardBody className="p-8 md:p-12">
            {/* Failed Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`relative transition-all duration-500 ${
                  animate ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                  <XCircle
                    size={56}
                    className="text-white animate-bounce-once"
                    strokeWidth={3}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Thanh toán thất bại
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Rất tiếc, thanh toán của bạn không thành công
              </p>
              {searchParams.get("code") && (
                <p className="text-sm text-gray-500">
                  Mã lỗi: {searchParams.get("code")}
                </p>
              )}
            </div>

            {/* Order Info */}
            {searchParams.get("orderCode") && (
              <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Mã đơn hàng</span>
                  <Chip color="default" variant="flat" size="sm">
                    {searchParams.get("orderCode").slice(0, -10)}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái</span>
                  <Chip color="danger" variant="dot" size="sm">
                    Thanh toán thất bại
                  </Chip>
                </div>
              </div>
            )}

            <Divider className="my-6" />

            {/* Troubleshooting */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                💡 Vui lòng kiểm tra:
              </h3>
              <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                <li>Số dư tài khoản đủ để thanh toán</li>
                <li>Thông tin thẻ/tài khoản chính xác</li>
                <li>Kết nối internet ổn định</li>
                <li>Hạn mức giao dịch ngân hàng</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                color="danger"
                size="lg"
                className="w-full font-semibold"
                onPress={handleViewOrder}
                endContent={<ArrowRight size={20} />}
              >
                Thử thanh toán lại
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="bordered"
                  size="lg"
                  className="font-medium"
                  onPress={handleContinueShopping}
                  startContent={<ShoppingBag size={18} />}
                >
                  Tiếp tục mua
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  className="font-medium"
                  onPress={handleBackToHome}
                >
                  Về trang chủ
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Cần hỗ trợ? Liên hệ{" "}
                <a
                  href="mailto:support@ecowrap.vn"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  support@ecowrap.vn
                </a>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
