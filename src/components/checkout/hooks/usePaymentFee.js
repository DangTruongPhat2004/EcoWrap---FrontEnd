// =============================================
// File: src/components/checkout/hooks/usePaymentFee.js
// =============================================
export default function usePaymentFee({
  method,
  region = "HCM",
  subtotal = 0,
}) {
  // PayOS: miễn phí thanh toán qua QR code
  let fee = 0;
  let label = "Phụ phí thanh toán";
  let note = "";

  if (method === "payos") {
    fee = 0;
    note = "Miễn phí thanh toán qua PayOS";
  } else if (method === "cod") {
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
  // if (subtotal > 1000000 && method === 'payos') { fee = -20000; note = 'PayOS ưu đãi -20k'; }

  return { fee, label, note };
}
