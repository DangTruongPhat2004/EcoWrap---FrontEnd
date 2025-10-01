// ví dụ siêu gọn – bạn đã có hooks & modal rồi
import React from "react";

import { useRegisterInit, useVerifyEmail } from "../hooks/useRegister";
import { toBackendRegister } from "../validation/schemas";
import RegisterForm from "../components/auth/RegisterForm";
import OtpModal from "../components/auth/OtpModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [emailLocked, setEmailLocked] = React.useState("");
  const [openOtp, setOpenOtp] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const COOLDOWN_SECONDS = 30;
  const lastPayloadRef = React.useRef(null);
  const timerRef = React.useRef(null);
  const navigate = useNavigate();
  const registerInit = useRegisterInit(); // wraps registerAccount()
  const verifyMut = useVerifyEmail(); // wraps verifyEmail()

  React.useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const handleSubmit = async (formData) => {
    try {
      const payload = toBackendRegister(formData);
      const res = await registerInit.mutateAsync(payload);

      const email = res?.email || payload.email;
      if (!email) throw new Error("Không lấy được email từ server.");

      // 🔔 Thông báo thành công
      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP."
      );

      // Điều hướng sang trang Verify OTP
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`, {
        state: { email, flash: "Đã gửi OTP tới email của bạn." },
      });
    } catch (e) {
      console.error("[register/init] error:", e);
      toast.error(e?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  const handleVerify = async (otp) => {
    const res = await verifyMut.mutateAsync({
      email: emailLocked,
      verificationCode: otp,
    });
    if (res?.isVerified) {
      setOpenOtp(false);
      window.location.href = "/login?justRegistered=1";
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !lastPayloadRef.current) return;
    await registerInit.mutateAsync(lastPayloadRef.current); // tạm re-register để gửi lại OTP
    setCooldown(COOLDOWN_SECONDS);
  };

  return (
    <>
      <RegisterForm
        submitting={registerInit.isPending}
        onSubmit={handleSubmit}
      />
      <OtpModal
        open={openOtp}
        onClose={() => setOpenOtp(false)}
        email={emailLocked}
        loading={verifyMut.isPending}
        cooldown={cooldown}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </>
  );
}
