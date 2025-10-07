import apiClient from "./apiClient"; // chỉnh path nếu file này ở nơi khác

export async function forgotPasswordRequest(email) {
  const { data } = await apiClient.post("/api/ForgotPassword/request", {
    email,
  });
  return data; // { message: "Mã OTP đã gửi vào email." }
}

export async function confirmResetPassword({ email, otp, newPassword }) {
  const { data } = await apiClient.post("/api/ForgotPassword/confirm", {
    email,
    otp,
    newPassword,
  });
  return data; // { message: "Đặt lại mật khẩu thành công." }
}
