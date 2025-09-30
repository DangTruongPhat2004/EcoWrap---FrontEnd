// Giải mã base64url → JSON payload
function b64urlDecode(str) {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
}

export function decodeJwt(token) {
  const parts = token?.split(".") || [];
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(b64urlDecode(parts[1]));
  } catch {
    return null;
  }
}

// Lấy id từ payload (ưu tiên 'id', fallback claim nameidentifier)
export function getUserIdFromToken(token) {
  const p = decodeJwt(token);
  if (!p) return null;
  return (
    p.id ||
    p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    null
  );
}
