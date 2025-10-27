// src/pages/CheckoutPage.jsx
import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import useShippingFee from "../components/checkout/hooks/useShippingFee";
import usePaymentFee from "../components/checkout/hooks/usePaymentFee";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import ShippingMethodSelector from "../components/checkout/ShippingMethodSelector";
import AddressForm from "../components/checkout/AddressForm";
import SummaryCard from "../components/cart/SummaryCard";
import CouponCard from "../components/checkout/CouponCard";
import { Bike } from "lucide-react";
import { fmtVND } from "../utils/money";
import { getAllCarts } from "../services/cartApi";
import { createOrder, declineOrder } from "../services/orderApi";
import { createPaymentLink } from "../services/paymentApi";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [placing, setPlacing] = React.useState(false);
  const [address, setAddress] = React.useState({
    fullName: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    hamlet: "",
    note: "",
  });
  const [shippingMethod, setShippingMethod] = React.useState("ghtk");
  const [paymentMethod, setPaymentMethod] = React.useState("payos");

  // Fetch cart data on mount
  React.useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await getAllCarts();
      const activeCart = response.data?.find((cart) => cart.isActive);

      if (activeCart && activeCart.items) {
        const transformedItems = activeCart.items.map((item) => ({
          id: item.cartItemId,
          cartItemId: item.cartItemId,
          productId: item.productId,
          name: item.productName || "Sản phẩm",
          variant: item.product?.productDescription || "",
          price: item.cartItemPrice / item.quantity,
          qty: item.quantity,
          image: item.product?.productImages?.[0] || null,
          designFile: item.designFile,
        }));
        setItems(transformedItems);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = React.useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const region = address.province || "TP. Hồ Chí Minh";

  const { fee: shipFee } = useShippingFee({ method: shippingMethod, region });
  const {
    fee: payFee,
    label: payLabel,
    note: payNote,
  } = usePaymentFee({
    method: paymentMethod,
    region,
    subtotal,
  });

  const extraFees = React.useMemo(() => {
    const arr = [];
    if (shipFee) arr.push({ label: `Phí vận chuyển`, amount: shipFee });
    if (payFee)
      arr.push({
        label: payLabel + (payNote ? ` (${payNote})` : ""),
        amount: payFee,
      });
    return arr;
  }, [shipFee, payFee, payLabel, payNote]);

  const handleApplyCoupon = (code) => {
    console.log("Apply coupon:", code);
    toast.success("Tính năng mã giảm giá đang phát triển");
  };

  const handlePlaceOrder = async () => {
    console.log("🚀 [CheckoutPage] Starting order placement flow");

    // Validate required address fields that match backend CreateOrderRequest
    if (
      !address.address?.trim() ||
      !address.province?.trim() ||
      !address.district?.trim() ||
      !address.ward?.trim() ||
      !address.hamlet?.trim()
    ) {
      console.error("❌ [CheckoutPage] Address validation failed:", address);
      toast.error(
        "Vui lòng điền đầy đủ thông tin địa chỉ giao hàng (Address, Province, District, Ward, Hamlet)"
      );
      return;
    }

    // Validate user info (not sent to backend but good UX)
    if (!address.fullName?.trim() || !address.phone?.trim()) {
      console.error("❌ [CheckoutPage] User info validation failed");
      toast.error("Vui lòng điền họ tên và số điện thoại");
      return;
    }

    if (items.length === 0) {
      console.error("❌ [CheckoutPage] Cart is empty");
      toast.error("Giỏ hàng trống");
      return;
    }

    try {
      setPlacing(true);
      console.log(
        "✅ [CheckoutPage] Validation passed, proceeding to create order"
      );

      // Step 1: Create order from cart
      const orderData = {
        address: address.address,
        province: address.province,
        district: address.district,
        ward: address.ward,
        hamlet: address.hamlet,
      };

      console.log(
        "📦 [CheckoutPage] Calling createOrder API with data:",
        orderData
      );
      const orderResponse = await createOrder(orderData);
      console.log("📦 [CheckoutPage] createOrder API response:", orderResponse);

      if (!orderResponse.success) {
        console.error(
          "❌ [CheckoutPage] Order creation failed:",
          orderResponse
        );
        toast.error(orderResponse.message || "Không thể tạo đơn hàng");
        return;
      }

      const orderId = orderResponse.data.orderId;
      console.log(
        "✅ [CheckoutPage] Order created successfully. Order ID:",
        orderId
      );
      toast.success("Đơn hàng đã được tạo!");

      // Step 2: Create payment link with PayOS
      try {
        console.log(
          "💳 [CheckoutPage] Calling createPaymentLink API with orderId:",
          orderId
        );
        const paymentResponse = await createPaymentLink(orderId);
        console.log(
          "💳 [CheckoutPage] createPaymentLink API response:",
          paymentResponse
        );

        if (paymentResponse.success && paymentResponse.checkoutUrl) {
          console.log("✅ [CheckoutPage] Payment link created successfully");
          console.log(
            "🌐 [CheckoutPage] Redirecting to PayOS URL:",
            paymentResponse.checkoutUrl
          );

          // Redirect to PayOS checkout page
          toast.success("Đang chuyển đến trang thanh toán...");
          window.location.href = paymentResponse.checkoutUrl;
        } else {
          console.error(
            "❌ [CheckoutPage] Payment link creation failed:",
            paymentResponse
          );
          // Payment link creation failed - cancel the order
          toast.error("Không thể tạo link thanh toán. Đang hủy đơn hàng...");

          try {
            await declineOrder(orderId);
            console.log("✅ [CheckoutPage] Order cancelled successfully");
          } catch (cancelErr) {
            console.error(
              "❌ [CheckoutPage] Failed to cancel order:",
              cancelErr
            );
          }

          // Stay on checkout page so user can try again
          toast.error("Vui lòng thử lại hoặc liên hệ hỗ trợ.");
        }
      } catch (paymentErr) {
        console.error(
          "❌ [CheckoutPage] Error creating payment link:",
          paymentErr
        );

        // Payment link API call failed - cancel the order
        toast.error("Lỗi khi tạo link thanh toán. Đang hủy đơn hàng...");

        try {
          await declineOrder(orderId);
          console.log("✅ [CheckoutPage] Order cancelled successfully");
        } catch (cancelErr) {
          console.error("❌ [CheckoutPage] Failed to cancel order:", cancelErr);
        }

        // Stay on checkout page so user can try again
        toast.error("Vui lòng thử lại hoặc liên hệ hỗ trợ.");
      }
    } catch (err) {
      console.error("❌ [CheckoutPage] Error in order placement flow:", err);
      const errorMessage =
        err?.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng";
      toast.error(errorMessage);
    } finally {
      setPlacing(false);
      console.log("🏁 [CheckoutPage] Order placement flow completed");
    }
  };

  return (
    <main className="bg-[#F6F7F3] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-sm text-gray-500 mb-2">
          Giỏ hàng › <span className="text-emerald-700">Thanh toán</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Thanh toán & Giao hàng
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-gray-600">Đang tải...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Giỏ hàng trống</p>
            <Button color="primary" onPress={() => navigate("/cart")}>
              Quay lại giỏ hàng
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="border border-gray-200">
                <CardBody className="p-5 space-y-3">
                  <PaymentMethodSelector
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                </CardBody>
              </Card>

              <Card className="border border-gray-200">
                <CardBody className="p-5 space-y-3">
                  <div className="text-base font-semibold text-gray-800 mb-1">
                    Tùy chọn giao hàng
                  </div>
                  <ShippingMethodSelector
                    value={shippingMethod}
                    onChange={setShippingMethod}
                    region={region}
                    className="border-0"
                  />
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-2 flex items-center gap-2">
                    <Bike className="w-4 h-4" />
                    Giao hàng bằng phương tiện xanh, giảm phát thải carbon!
                  </div>
                </CardBody>
              </Card>

              <CouponCard onApply={handleApplyCoupon} />

              <Card className="border border-gray-200">
                <CardBody className="p-5">
                  <div className="text-base font-semibold text-gray-800 mb-3">
                    Thông tin người nhận
                  </div>
                  <AddressForm
                    value={address}
                    onChange={setAddress}
                    title=""
                    showSave={false}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="space-y-3">
              <SummaryCard
                items={items}
                shippingText={
                  shipFee ? fmtVND(shipFee) : "Tính khi nhập địa chỉ"
                }
                extraFees={extraFees}
                onPlaceOrder={handlePlaceOrder}
                placing={placing}
                onBackToCart={() => navigate("/cart")}
                ctaLabel="Hoàn tất đơn hàng"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
