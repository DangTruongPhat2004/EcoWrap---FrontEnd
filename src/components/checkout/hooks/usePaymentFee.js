// =============================================
// File: src/components/checkout/hooks/usePaymentFee.js
// =============================================
export default function usePaymentFee({
  method,
  region = "HCM",
  subtotal = 0,
}) {
  // Quy ước demo: COD có phụ phí, Bank/Ví/Thẻ 0đ. Ngoại thành COD đắt hơn.
  let fee = 0;
  let label = "Phụ phí thanh toán";
  let note = "";

  if (method === "cod") {
    fee = region === "HCM" ? 10000 : 20000; // đ
    note = region === "HCM" ? "COD nội thành" : "COD ngoại thành";
  } else if (method === "bank") {
    fee = 0;
    note = "Miễn phí chuyển khoản";
  } else if (method === "momo" || method === "vnpay") {
    fee = 0;
    note = "Miễn phí ví điện tử";
  }

  // Có thể thêm ưu đãi theo ngưỡng subtotal
  // if (subtotal > 1000000 && method === 'vnpay') { fee = -20000; note = 'VNPAY ưu đãi -20k'; }

  return { fee, label, note };
}
