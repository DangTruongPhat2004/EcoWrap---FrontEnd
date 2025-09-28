import { Banknote } from "lucide-react";

function PaymentIconsRow() {
  const base =
    "inline-flex h-10 w-[68px] items-center justify-center rounded-md " +
    "bg-[#B2BAC3] text-white shadow-sm select-none";

  return (
    <div className="mt-4 flex items-center justify-center gap-6">
      {/* VISA */}
      <div className={base}>
        <span className="font-semibold tracking-wider text-[12px]">VISA</span>
      </div>

      {/* Mastercard (2 vòng tròn giao nhau) */}
      <div className={base}>
        <div className="relative">
          <span
            className="absolute -left-3 top-1/2 -translate-y-1/2 block h-6 w-6 rounded-full bg-white/90"
            aria-hidden
          />
          <span
            className="absolute -right-3 top-1/2 -translate-y-1/2 block h-6 w-6 rounded-full bg-white/70"
            aria-hidden
          />
          <span className="sr-only">Mastercard</span>
        </div>
      </div>

      {/* PayPal (wordmark đơn giản) */}
      <div className={base}>
        <span className="font-semibold text-[12px]">PayPal</span>
      </div>

      {/* COD / Tiền mặt */}
      <div className={base}>
        <Banknote className="w-5 h-5" aria-label="Cash on Delivery" />
      </div>
    </div>
  );
}

export default PaymentIconsRow;
