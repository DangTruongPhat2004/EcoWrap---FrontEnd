// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:7077",
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
    if (err?.response?.status === 401) localStorage.removeItem("token");
    return Promise.reject(err);
  }
);

export default apiClient;
