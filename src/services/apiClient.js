// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 10000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: true, // TẮT tạm để tránh CORS kiểu credentials
});

// log base URL khi file được import
console.log("[API BASE]", apiClient.defaults.baseURL);

// log mọi request gửi đi
apiClient.interceptors.request.use((config) => {
  console.log(
    "[API REQ]",
    (config.method || "GET").toUpperCase(),
    (config.baseURL || "") + config.url
  );
  // token demo
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(
      "[API ERR]",
      err?.message,
      err?.response?.status,
      err?.response?.data
    );
    // Only remove token for actual authentication failures (not for other 401s like update conflicts)
    // Check if it's a login/auth endpoint or if the error message indicates invalid token
    const isAuthEndpoint =
      err?.config?.url?.includes("/Authentication/") ||
      err?.config?.url?.includes("/auth/");
    const isInvalidToken =
      err?.response?.data?.message?.toLowerCase()?.includes("token") ||
      err?.response?.data?.message?.toLowerCase()?.includes("unauthorized");

    if (err?.response?.status === 401 && (isAuthEndpoint || isInvalidToken)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
