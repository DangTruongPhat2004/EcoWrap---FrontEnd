// =============================================
// File: src/components/checkout/hooks/useShippingFee.js
// =============================================
export default function useShippingFee({ method, region = "HCM" }) {
  // Quy tắc demo đồng nhất với selector ở trên
  let fee = 0;
  let eta = "";
  switch (method) {
    case "standard":
      fee = region === "HCM" ? 20000 : 40000;
      eta = region === "HCM" ? "2–3 ngày" : "3–4 ngày";
      break;
    case "express":
      fee = region === "HCM" ? 40000 : 70000;
      eta = "1–2 ngày";
      break;
    case "insta":
      fee = region === "HCM" ? 30000 : null; // null = không khả dụng
      eta = region === "HCM" ? "2–6 giờ" : "—";
      break;
    default:
      fee = 0;
      eta = "—";
  }
  return { fee, eta };
}
