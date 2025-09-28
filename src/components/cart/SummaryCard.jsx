// src/components/cart/SummaryCard.jsx
import React from "react";
import { Card, CardBody, Divider, Input, Button } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";
import { fmtVND } from "../../utils/money";

export default function SummaryCard({
  items,
  shippingText = "Tính khi nhập địa chỉ",
  extraFees = [], // [{label, amount}]
  showCoupon = true,
  ctaLabel = "Hoàn tất đơn hàng",
  onPlaceOrder,
  placing = false,
  onBackToCart, // <-- nếu KHÔNG truyền prop này thì nút Back sẽ ẩn
  backLabel = "Quay lại giỏ hàng",
}) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const totalQty = items.reduce((s, it) => s + it.qty, 0);

  const [coupon, setCoupon] = React.useState("");
  const [discount, setDiscount] = React.useState(0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "ECO10") {
      setDiscount(Math.round(subtotal * 0.1));
    } else {
      setDiscount(0);
      alert("Mã không hợp lệ. Dùng thử ECO10");
    }
  };

  const extraTotal = extraFees.reduce((s, f) => s + (f.amount || 0), 0);
  const total = Math.max(0, subtotal - discount + extraTotal);

  return (
    <Card className="border border-gray-200 bg-white rounded-lg shadow">
      <CardBody className="p-5">
        {/* Title */}
        <div className="text-[20px] font-semibold text-[#8C6A3D]">
          Tóm tắt đơn hàng
        </div>

        {/* Rows */}
        <div className="mt-3 space-y-6 text-sm">
          <Row label="Tổng số lượng:" value={`${totalQty} sản phẩm`} />
          <Row label="Tạm tính:" value={fmtVND(subtotal)} />
          <Row label="Phí vận chuyển:" value={shippingText} dim />
          {extraFees.map((f, idx) => (
            <Row key={idx} label={f.label} value={fmtVND(f.amount)} dim />
          ))}
          {discount > 0 && (
            <Row label="Giảm giá:" value={`- ${fmtVND(discount)}`} dim />
          )}
        </div>

        <Divider className="my-3" />

        {/* Total */}
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold text-gray-900 text-lg">
              Tổng cộng:
            </div>
            <div className="text-xs text-gray-500">(Đã bao gồm VAT)</div>
          </div>
          <div className="text-[#8C6A3D] font-extrabold text-lg">
            {fmtVND(total)}
          </div>
        </div>

        {/* Coupon */}
        {showCoupon && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Mã giảm giá</div>
            <div className="flex">
              <Input
                aria-label="Mã giảm giá"
                placeholder="Nhập mã giảm giá"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                classNames={{
                  inputWrapper:
                    "rounded-l-xl rounded-r-none h-11 shadow-none border border-gray-300",
                  input: "text-sm",
                }}
              />
              <Button
                onPress={applyCoupon}
                className="h-11 rounded-r-xl rounded-l-none px-5 bg-[#9C7A4C] text-white hover:opacity-95"
              >
                Áp dụng
              </Button>
            </div>
            {discount > 0 && (
              <div className="mt-2 text-sm text-emerald-700">
                Đã áp dụng giảm {fmtVND(discount)} (ECO10)
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <Button
          className="mt-5 w-full h-11 bg-[#0F8A44] text-white hover:bg-[#0c6f37] font-semibold rounded-lg"
          endContent={<ArrowRight className="w-4 h-4" />}
          isLoading={placing}
          onPress={onPlaceOrder}
        >
          {ctaLabel}
        </Button>

        {/* Back button: chỉ hiện khi có onBackToCart */}
        {onBackToCart && (
          <Button
            variant="bordered"
            className="mt-3 w-full h-11 font-semibold border-2 border-gray-300 text-gray-700 bg-white rounded-lg"
            onPress={onBackToCart}
          >
            {backLabel}
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

function Row({ label, value, dim = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-gray-700 ${dim ? "opacity-80" : ""}`}>
        {label}
      </span>
      <span
        className={`font-medium ${dim ? "text-gray-600" : "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}
