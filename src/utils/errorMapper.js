// utils/errorMapper.js
export function mapApiError(
  err,
  fallback = "Đã có lỗi xảy ra. Vui lòng thử lại."
) {
  // LOG tạm để thấy chi tiết
  // eslint-disable-next-line no-console
  console.error("[API ERROR]", {
    status: err?.response?.status,
    data: err?.response?.data,
    headers: err?.response?.headers,
    message: err?.message,
  });

  const res = err?.response;
  const data = res?.data;

  // Axios Network error (CORS, cert, server down, preflight fail…)
  if (!res)
    return {
      code: "NETWORK_ERROR",
      message: "Không thể kết nối máy chủ (CORS/Network).",
      fieldErrors: null,
    };

  // .NET ProblemDetails
  if (data?.title || data?.detail || data?.type) {
    const msg = data.detail || data.title || fallback;
    return {
      code: data.type || data.status || "PROBLEM_DETAILS",
      message: msg,
      fieldErrors: data.errors || null,
    };
  }

  // ModelState errors: { errors: { field: [msg] } }
  if (data?.errors && typeof data.errors === "object") {
    const firstField = Object.keys(data.errors)[0];
    const firstMsg = firstField ? data.errors[firstField]?.[0] : null;
    return {
      code: "VALIDATION_ERROR",
      message: firstMsg || fallback,
      fieldErrors: data.errors,
    };
  }

  // Custom { code, message }
  if (data?.message || data?.code) {
    return {
      code: data.code || "ERROR",
      message: data.message || fallback,
      fieldErrors: data.fieldErrors || null,
    };
  }

  return { code: "UNKNOWN", message: fallback, fieldErrors: null };
}
