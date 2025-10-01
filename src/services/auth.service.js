import apiClient from "../services/apiClient";

// { username, password, email, fullName, phoneNumber }
export async function registerAccount(payload) {
  const { data } = await apiClient.post(
    "/api/RegisterAccount/register",
    payload
  );
  // data: { message, email, username }
  return data;
}

// { email, verificationCode }
export async function verifyEmail(payload) {
  const { data } = await apiClient.post("/api/VerifyEmail/verify", payload);
  // data: { message, email, isVerified: true }
  return data;
}

// POST https://localhost:7077/api/Authentication/login
export async function login({ username, password }) {
  const res = await apiClient.post("/api/Authentication/login", {
    username,
    password,
  });
  const token = res?.data?.token;
  if (!token) throw new Error("Không nhận được token từ server");
  localStorage.setItem("token", token); // apiClient sẽ tự gắn Authorization ở interceptor
  return token;
}

// GET https://localhost:7077/api/Users/{id}
export async function getUserById(id) {
  const res = await apiClient.get(`/api/Users/${id}`);
  return res.data;
}

// Xoá token khi logout
export function logout() {
  localStorage.removeItem("token");
}
