import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@nextui-org/react";

/**
 * Payment Return Page
 * This page handles the return from PayOS payment gateway
 * PayOS will redirect here with query parameters indicating payment status
 */
export default function PaymentReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing"); // processing, success, failed

  useEffect(() => {
    // PayOS typically returns with these parameters:
    // - code: Payment status code
    // - id: Transaction ID
    // - orderCode: Your order code (format: {orderId}{MMddHHmmss} - e.g., 1231028151030)
    // - cancel: true if payment was cancelled

    const code = searchParams.get("code");
    const cancel = searchParams.get("cancel");
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
    if (cancel === "true") {
      setStatus("cancelled");
    } else if (code === "00") {
      // Code "00" typically means success in Vietnamese payment gateways
      setStatus("success");
    } else if (code) {
      setStatus("failed");
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
    const orderId =
      searchParams.get("orderCode") || sessionStorage.getItem("lastOrderId");
    if (orderId) {
      navigate(`/order-success?orderId=${orderId}`);
    } else {
      navigate("/customer/orders");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.
          </p>
          <div className="space-y-3">
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onPress={handleViewOrder}
            >
              Xem đơn hàng
            </Button>
            <Button
              variant="bordered"
              size="lg"
              className="w-full"
              onPress={handleBackToHome}
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <XCircle size={48} className="text-gray-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Thanh toán đã bị hủy
          </h1>
          <p className="text-gray-600 mb-8">
            Bạn đã hủy thanh toán. Đơn hàng của bạn vẫn ở trạng thái chờ thanh
            toán.
          </p>
          <div className="space-y-3">
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onPress={handleViewOrder}
            >
              Xem đơn hàng
            </Button>
            <Button
              variant="bordered"
              size="lg"
              className="w-full"
              onPress={handleBackToHome}
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Failed status
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle size={48} className="text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Thanh toán thất bại
        </h1>
        <p className="text-gray-600 mb-2">
          Rất tiếc, thanh toán của bạn không thành công.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Mã lỗi: {searchParams.get("code")}
        </p>
        <div className="space-y-3">
          <Button
            color="primary"
            size="lg"
            className="w-full"
            onPress={handleViewOrder}
          >
            Thử lại thanh toán
          </Button>
          <Button
            variant="bordered"
            size="lg"
            className="w-full"
            onPress={handleBackToHome}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
