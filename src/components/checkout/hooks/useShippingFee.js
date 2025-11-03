// =============================================
// File: src/components/checkout/hooks/useShippingFee.js
// =============================================
export default function useShippingFee({ method, region = "HCM" }) {
  // GHTK shipping fees based on region
  let fee = 0;
  let eta = "";

  if (method === "ghtk") {
    fee = region === "HCM" ? 25000 : 45000;
    eta = region === "HCM" ? "2–3 ngày" : "3–5 ngày";
  } else {
    // Fallback for any other method
    fee = 0;
    eta = "—";
  }

  return { fee, eta };
}
