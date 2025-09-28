// File: src/pages/CheckoutPaymentSection.jsx (example usage)
// =============================================
import React from "react";
import { Button } from "@nextui-org/react";
import { PaymentMethodSelector } from "../components/checkout/PaymentMethodSelector";
import BankTransferModal from "../components/checkout/BankTransferModal";
import usePaymentFee from "../components/checkout/hooks/usePaymentFee";
import SummaryCard from "../components/cart/SummaryCard";
export default function CheckoutPaymentSection() {
  const [method, setMethod] = React.useState("vnpay");
  const [bankOpen, setBankOpen] = React.useState(false);

  // Demo data
  const items = [{ id: "bag", price: 2000, qty: 100 }];
  const region = "HCM"; // TODO: lấy từ địa chỉ giao hàng

  const { fee, label, note } = usePaymentFee({
    method,
    region,
    subtotal: items.reduce((s, it) => s + it.price * it.qty, 0),
  });

  React.useEffect(() => {
    if (method === "bank") setBankOpen(true);
  }, [method]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <PaymentMethodSelector value={method} onChange={setMethod} />
      </div>

      {/* Summary bên phải, truyền phụ phí thanh toán */}
      <div>
        <SummaryCard
          items={items}
          extraFees={
            fee
              ? [{ label: label + (note ? ` (${note})` : ""), amount: fee }]
              : []
          }
        />
      </div>

      <BankTransferModal isOpen={bankOpen} onClose={() => setBankOpen(false)} />
    </div>
  );
}

// =============================================
// NOTE: Patch nhẹ cho SummaryCard để hiển thị phụ phí phương thức
// - Thêm prop optional: `extraFees = []` dạng [{label: string, amount: number}]
// - Render các dòng này trước Divider và cộng vào total.
//
// Trong SummaryCard.jsx:
//   export default function SummaryCard({ items, shippingText = "…", extraFees = [] }) {
//     const extraTotal = extraFees.reduce((s, r) => s + (r.amount || 0), 0);
//     const total = Math.max(0, subtotal - discount + extraTotal);
//
//     // Trong phần Rows:
//     {extraFees.map((r) => (
//       <Row key={r.label} label={r.label + ':'} value={(r.amount>=0? '+':'') + fmtVND(r.amount)} />
//     ))}
//   }
