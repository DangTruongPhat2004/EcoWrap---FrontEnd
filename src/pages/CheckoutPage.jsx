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

const DEMO_ITEMS = [
  { id: "bag-26x32", name: "Túi Giấy Kraft 26×32cm", price: 2000, qty: 100 },
];

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [items] = React.useState(DEMO_ITEMS);
  const [address, setAddress] = React.useState({ city: "HCM" });
  const [shippingMethod, setShippingMethod] = React.useState("express");
  const [paymentMethod, setPaymentMethod] = React.useState("vnpay");

  const subtotal = React.useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const region = address.city || "HCM";

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

  const orderTotal = (subtotal || 0) + (shipFee || 0) + (payFee || 0);

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

  const orderCode = React.useMemo(
    () => "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    []
  );
  const expiresAt = React.useMemo(() => Date.now() + 30 * 60 * 1000, []);

  const handleApplyCoupon = (code) => {
    console.log("Apply coupon:", code);
  };

  const handlePlaceOrder = () => {
    // TODO (bản thật): gọi API tạo order -> server trả data thật
    if (paymentMethod === "bank") {
      const params = new URLSearchParams({
        orderCode,
        amount: String(orderTotal),
        bankCode: "VCB",
        accountNumber: "0123456789",
        accountName: "CONG TY ECOWRAP",
        expiresAt: String(expiresAt),
      }).toString();
      navigate(`/bank-transfer?${params}`);
      return;
    }
    alert(`Đặt hàng với phương thức: ${paymentMethod} (demo)`);
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
              shippingText={shipFee ? fmtVND(shipFee) : "Tính khi nhập địa chỉ"}
              extraFees={extraFees}
              onPlaceOrder={handlePlaceOrder}
              placing={false}
              onBackToCart={() => navigate("/cart")}
              ctaLabel="Hoàn tất đơn hàng"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
