// src/pages/VerifyOtpPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Button, Divider } from "@nextui-org/react";
import { useVerifyEmail, useResendOtp } from "../hooks/useRegister";

const COOLDOWN_SECONDS = 30;
const OTP_LEN = 6;

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy email từ state -> query -> localStorage
  const searchEmail = new URLSearchParams(location.search).get("email") || "";
  const stateEmail = location.state?.email || "";
  const storedEmail =
    typeof window !== "undefined" ? localStorage.getItem("otpEmail") : "";
  const email = stateEmail || searchEmail || storedEmail || "";

  const [otp, setOtp] = React.useState("");
  const [err, setErr] = React.useState("");
  const [cooldown, setCooldown] = React.useState(COOLDOWN_SECONDS);

  // Flash banner (ví dụ: "Đã gửi OTP, kiểm tra email")
  const flash = location.state?.flash || "";
  const [status, setStatus] = React.useState(
    flash ? { type: "success", msg: flash } : { type: "", msg: "" }
  );

  const verifyMut = useVerifyEmail();
  const resendMut = useResendOtp();

  const cellRefs = React.useRef(
    Array.from({ length: OTP_LEN }, () => React.createRef())
  );
  const timerRef = React.useRef(null);

  // Helpers
  const setOtpAt = (idx, digit) => {
    const arr = otp.split("");
    arr[idx] = digit;
    const next = arr.join("").padEnd(OTP_LEN, "").slice(0, OTP_LEN);
    setOtp(next);
  };

  const handleCellChange = (e, idx) => {
    const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    if (!v) {
      setOtpAt(idx, "");
      return;
    }
    setOtpAt(idx, v);
    // nhảy focus sang ô kế tiếp
    if (idx < OTP_LEN - 1) {
      cellRefs.current[idx + 1]?.current?.focus();
      cellRefs.current[idx + 1]?.current?.select?.();
    }
    if (err && otp.replace(/[^0-9]/g, "").length + 1 === OTP_LEN) setErr("");
  };

  const handleCellKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (!otp[idx]) {
        // nếu ô đang trống -> lùi về ô trước
        if (idx > 0) {
          setOtpAt(idx - 1, "");
          cellRefs.current[idx - 1]?.current?.focus();
        }
      } else {
        // xoá ký tự ở ô hiện tại
        setOtpAt(idx, "");
      }
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      cellRefs.current[idx - 1]?.current?.focus();
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowRight" && idx < OTP_LEN - 1) {
      cellRefs.current[idx + 1]?.current?.focus();
      e.preventDefault();
      return;
    }
    if (
      e.key === "Enter" &&
      otp.replace(/[^0-9]/g, "").length === OTP_LEN &&
      !verifyMut.isPending
    ) {
      submit();
    }
  };

  const handleCellsPaste = (e) => {
    const raw = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!raw) return;
    e.preventDefault();

    const n = Math.min(raw.length, OTP_LEN);
    const filled = raw.slice(0, OTP_LEN);
    const next = filled.padEnd(OTP_LEN, "");
    setOtp(next);

    // Focus đúng ô cuối cùng có số thực sự (n-1), không phải luôn cuối mảng
    const lastIdx = n - 1;
    if (lastIdx >= 0) cellRefs.current[lastIdx]?.current?.focus();

    if (err && n === OTP_LEN) setErr("");
  };

  // Lưu email & focus ô đầu (nếu muốn)
  React.useEffect(() => {
    if (email) localStorage.setItem("otpEmail", email);
    // Focus ô đầu tiên
    setTimeout(() => cellRefs.current[0]?.current?.focus(), 0);
  }, [email]);

  // Cooldown resend
  React.useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const submit = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setErr("OTP phải gồm 6 chữ số");
      return;
    }
    setErr("");
    setStatus({ type: "", msg: "" });

    try {
      const res = await verifyMut.mutateAsync({ email, verificationCode: otp });
      if (res?.isVerified === true) {
        setStatus({
          type: "success",
          msg: "Xác thực thành công! Đang chuyển sang trang đăng nhập...",
        });
        setTimeout(() => {
          localStorage.removeItem("otpEmail");
          navigate("/login?justRegistered=1", { replace: true });
        }, 800);
      } else {
        setStatus({
          type: "error",
          msg: res?.message || "OTP không đúng hoặc đã hết hạn.",
        });
      }
    } catch (e) {
      setStatus({
        type: "error",
        msg: e?.message || "Xác thực OTP thất bại. Vui lòng thử lại.",
      });
    }
  };

  const handleResend = async () => {
    if (verifyMut.isPending || resendMut.isPending || cooldown > 0) return;
    try {
      await resendMut.mutateAsync({ email }); // BE đang re-init để resend
      setStatus({
        type: "success",
        msg: "Đã gửi lại OTP. Vui lòng kiểm tra email.",
      });
      setCooldown(COOLDOWN_SECONDS);
    } catch (e) {
      setStatus({
        type: "error",
        msg: e?.message || "Gửi lại OTP thất bại. Vui lòng thử lại.",
      });
    }
  };

  if (!email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-lg font-semibold">
            Thiếu email xác thực
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-gray-600">
              Không tìm thấy email để xác thực. Vui lòng đăng ký lại.
            </p>
            <Button color="primary" onPress={() => navigate("/register")}>
              Quay về đăng ký
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white/50 px-3">
      <Card className="max-w-md w-full bg-white/50 px-3 py-4 shadow-lg">
        <CardHeader className="text-lg font-semibold">
          Xác thực email
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {/* Banner thông báo */}
          {status.msg ? (
            <div
              role="alert"
              className={
                "text-sm rounded-lg px-3 py-2 " +
                (status.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200")
              }
            >
              {status.msg}
            </div>
          ) : null}

          <p className="text-sm text-gray-600">
            Mã OTP đã gửi tới <b>{email}</b>. Hết hạn sau 15 phút.
          </p>

          {/* Ô vuông OTP (6 số) */}
          <div
            className="flex items-center justify-between gap-2 select-none"
            onPaste={handleCellsPaste}
          >
            {Array.from({ length: OTP_LEN }).map((_, idx) => (
              <input
                key={idx}
                ref={cellRefs.current[idx]}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={otp[idx] ?? ""}
                onChange={(e) => handleCellChange(e, idx)}
                onKeyDown={(e) => handleCellKeyDown(e, idx)}
                className={
                  "w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl " +
                  "rounded-xl border outline-none " +
                  "border-gray-300 bg-white " +
                  "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 " +
                  (err
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100 "
                    : "")
                }
                aria-label={`OTP digit ${idx + 1}`}
              />
            ))}
          </div>

          {err ? (
            <p className="text-xs text-red-500">{err}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Bạn có thể dán trực tiếp 6 số vào bất kỳ ô nào.
            </p>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="flat"
              onPress={handleResend}
              isDisabled={
                verifyMut.isPending || resendMut.isPending || cooldown > 0
              }
            >
              {cooldown > 0 ? `Gửi lại (${cooldown}s)` : "Gửi lại mã"}
            </Button>
            <Button
              color="success"
              onPress={submit}
              isLoading={verifyMut.isPending}
              isDisabled={
                verifyMut.isPending ||
                otp.replace(/[^0-9]/g, "").length !== OTP_LEN
              }
            >
              Xác thực
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Không nhận được email? Kiểm tra Spam hoặc{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className={`underline ${
                cooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              gửi lại mã
            </button>
            .
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
