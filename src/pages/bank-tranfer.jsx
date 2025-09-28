// src/pages/bank-transfer.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, CardBody } from "@nextui-org/react";
import BankTransferPanel from "../components/checkout/BankTransferPanel";

function useCountdown(targetMs) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const remain = Math.max(0, Number(targetMs) - now);
  const m = Math.floor(remain / 60000);
  const s = Math.floor((remain % 60000) / 1000);
  return {
    remain,
    label: `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
  };
}

export default function BankTransferPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const orderCode = sp.get("orderCode");
  const amount = Number(sp.get("amount") || 0);
  const bankCode = sp.get("bankCode") || "VCB";
  const accountNumber = sp.get("accountNumber") || "0123456789";
  const accountName = sp.get("accountName") || "CONG TY ECOWRAP";
  const expiresAt = Number(sp.get("expiresAt") || Date.now() + 30 * 60 * 1000);

  const { label } = useCountdown(expiresAt);

  const transferNote = React.useMemo(() => {
    if (orderCode) return `EW-ORDER-${orderCode}`;
    return `EW-ORDER-DEMO-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
  }, [orderCode]);

  const handlePaid = () => {
    alert("Cảm ơn bạn! Chúng tôi sẽ kiểm tra và xác nhận thanh toán (demo).");
    navigate("/"); // hoặc điều hướng tới trang đơn hàng
  };

  const handleChangeMethod = () => {
    navigate("/CheckoutPage"); // đổi theo route thật của bạn
  };

  return (
    <main className="bg-[#F6F7F3] min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="text-sm text-gray-500">
          Thanh toán ›{" "}
          <span className="text-emerald-700">Chuyển khoản ngân hàng</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Quét QR & chuyển khoản
        </h1>

        <Card className="border border-amber-200 bg-amber-50">
          <CardBody className="p-4 flex items-center justify-between gap-3">
            <div className="text-amber-800 text-sm">
              Vui lòng hoàn tất chuyển khoản trong thời gian quy định để tránh
              huỷ đơn.
            </div>
            <div className="text-lg font-semibold text-amber-900 tabular-nums">
              {label}
            </div>
          </CardBody>
        </Card>

        <BankTransferPanel
          bankCode={bankCode}
          accountNumber={accountNumber}
          accountName={accountName}
          amount={amount}
          transferNote={transferNote}
          expiresAt={expiresAt}
          onIHavePaid={handlePaid}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="flat"
            onPress={handleChangeMethod}
            className="sm:w-1/3"
          >
            Đổi phương thức
          </Button>
          <Button onPress={handlePaid} color="primary" className="sm:flex-1">
            Tôi đã chuyển khoản
          </Button>
        </div>
      </div>
    </main>
  );
}
