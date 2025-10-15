// src/pages/Login.jsx
import React from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Checkbox,
  Link,
  Divider,
} from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

// helper: decode JWT để lấy id
function b64urlDecode(str) {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  try {
    return atob(base64);
  } catch {
    return "";
  }
}
function decodeJwt(token) {
  const parts = token?.split(".") || [];
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(b64urlDecode(parts[1]));
  } catch {
    return null;
  }
}
function getUserIdFromToken(token) {
  const p = decodeJwt(token);
  if (!p) return null;
  return (
    p.id ||
    p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    null
  );
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ---- state ----
  const [form, setForm] = React.useState({
    username: "",
    password: "",
    remember: false,
  });
  const [touched, setTouched] = React.useState({
    username: false,
    password: false,
  });
  const [errors, setErrors] = React.useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState({ type: "", msg: "" });

  // ---- styles ----
  const inputStyles = {
    inputWrapper:
      "border border-gray-300 rounded-lg bg-white shadow-none " +
      "data-[hover=true]:border-gray-400 group-data-[focus=true]:border-emerald-600 " +
      "ring-0 focus:ring-0 data-[focus=true]:ring-0 " +
      "focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:border-emerald-600",
    input:
      "text-[15px] placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none appearance-none",
  };

  // ---- validate ----
  const validate = (values) => {
    const next = { username: "", password: "" };
    if (!values.username) next.username = "Vui lòng nhập tên đăng nhập";
    else if (values.username.length < 3)
      next.username = "Tên đăng nhập tối thiểu 3 ký tự";
    if (!values.password) next.password = "Vui lòng nhập mật khẩu";
    else if (values.password.length < 6)
      next.password = "Mật khẩu tối thiểu 6 ký tự";
    return next;
  };

  const onChange = (field) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    if (touched[field]) setErrors(validate(nextForm));
  };

  const onBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    const v = validate(form);
    setErrors(v);
    if (Object.values(v).some(Boolean)) return;

    setStatus({ type: "", msg: "" });
    try {
      setSubmitting(true);

      // 1) Login -> nhận token
      const res = await apiClient.post("/api/Authentication/login", {
        username: form.username,
        password: form.password,
      });

      const token = res?.data?.token;
      if (!token) {
        // BE trả 200 nhưng không có token => coi như sai thông tin
        throw Object.assign(new Error("INVALID_CREDENTIALS"), { code: 401 });
      }

      // 2) Lưu token (interceptor sẽ tự gắn Authorization ở mọi request tiếp theo)
      localStorage.setItem("token", token);

      // 3) Lấy userId từ token -> fetch hồ sơ
      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error("Không tìm thấy ID trong token.");

      const meRes = await apiClient.get(`/api/Users/${userId}`);
      const me = meRes?.data || null;

      // 3.1) Lưu user để các nơi khác có thể đọc ngay (và giữ sau refresh)
      localStorage.setItem("user", JSON.stringify(me));

      // 3.2) Phát sự kiện để Header (hoặc component khác) có thể cập nhật ngay lập tức
      // Header có thể lắng nghe:
      //   window.addEventListener("auth:updated", (e) => setUser(e.detail.user));
      window.dispatchEvent(
        new CustomEvent("auth:updated", { detail: { token, user: me } })
      );

      setStatus({ type: "success", msg: "Đăng nhập thành công!" });

      // 4) Điều hướng sau login dựa trên role
      const from = location.state?.from || "/";
      let redirectTo = from;

      // Nếu không có from cụ thể hoặc from là "/", chuyển hướng theo role
      if (from === "/" || !from) {
        if (me.role === "Admin") {
          redirectTo = "/admin";
        } else if (me.role === "Seller") {
          redirectTo = "/vendor";
        } else if (me.role === "User") {
          redirectTo = "/customer";
        } else {
          redirectTo = "/"; // fallback
        }
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Chuẩn hoá thông điệp lỗi
      const httpStatus = err?.response?.status || err?.code;
      let message = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (httpStatus === 401) {
        message = "Tên đăng nhập hoặc mật khẩu không đúng.";
        // set lỗi vào trường password để user thấy ngay
        setErrors((prev) => ({ ...prev, password: message }));
      } else if (
        httpStatus === 409 ||
        err?.response?.data?.code === "EMAIL_NOT_VERIFIED"
      ) {
        message =
          "Email chưa được xác thực. Vui lòng kiểm tra hộp thư để xác thực.";
      } else if (
        httpStatus === "ECONNABORTED" ||
        err?.message?.includes("timeout")
      ) {
        message = "Kết nối máy chủ quá thời gian. Vui lòng thử lại.";
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      }

      setStatus({ type: "error", msg: message });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    !Object.values(validate(form)).some(Boolean) && !submitting;

  return (
    <div className="ecw-auth w-full min-h-[100svh] bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]">
      <div className="flex items-center justify-center min-h-full py-12 px-4">
        <div className="max-w-md w-full">
          <Card className="shadow-lg bg-white/95 backdrop-blur-sm">
            <CardBody className="p-8">
              <div className="text-center mb-2">
                <div className="w-[180px] h-[120px] rounded mx-auto mb-1 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="EcoWrap Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  Đăng nhập
                </h2>
                <p className="text-[#6B7280] text-sm">
                  Truy cập vào tài khoản{" "}
                  <strong className="text-green-600">EcoWrap</strong> của bạn
                </p>
              </div>

              {/* Banner thông báo */}
              {status.msg ? (
                <div
                  role="alert"
                  className={
                    "mb-4 text-sm rounded-lg px-3 py-2 " +
                    (status.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200")
                  }
                >
                  {status.msg}
                </div>
              ) : null}

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <label htmlFor="username" className="sr-only">
                  Tên đăng nhập
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  variant="bordered"
                  color="success"
                  autoComplete="username"
                  autoCapitalize="off"
                  autoCorrect="off"
                  value={form.username}
                  onChange={onChange("username")}
                  onBlur={onBlur("username")}
                  isInvalid={touched.username && !!errors.username}
                  errorMessage={touched.username ? errors.username : ""}
                  classNames={inputStyles}
                  required
                />

                <label htmlFor="password" className="sr-only">
                  Mật khẩu
                </label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  variant="bordered"
                  color="success"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={onChange("password")}
                  onBlur={onBlur("password")}
                  isInvalid={touched.password && !!errors.password}
                  errorMessage={touched.password ? errors.password : ""}
                  classNames={inputStyles}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="outline-none"
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path
                            d="M2 2l20 20M10 10a2 2 0 002 4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path
                            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      )}
                    </button>
                  }
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer select-none">
                    <Checkbox
                      name="remember"
                      isSelected={form.remember}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, remember: v }))
                      }
                      color="success"
                      size="sm"
                      disableAnimation
                      classNames={{
                        base: "m-0 p-0",
                        wrapper: "static h-4 w-4",
                        label: "hidden",
                        icon: "h-4 w-4",
                      }}
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>

                  <Link href="/reset-password" color="success" size="sm">
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button
                  type="submit"
                  color="success"
                  className="w-full font-semibold bg-green-600 hover:bg-emerald-600 focus:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  isLoading={submitting}
                  disabled={!isFormValid}
                >
                  Đăng nhập
                </Button>

                <div className="text-center">
                  <p className="text-[#6B7280] text-sm ">
                    Chưa có tài khoản?{" "}
                    <Link
                      href="/register"
                      className="text-green-600 hover:text-emerald-700 transition-colors"
                    >
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative flex items-center justify-center">
                  <Divider className="flex-1" />
                  <span className="px-4 text-sm text-[#6B7280] bg-white">
                    Hoặc tiếp tục với
                  </span>
                  <Divider className="flex-1" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 ">
                  <Button
                    variant="bordered"
                    className="w-full"
                    type="button"
                    startContent={
                      <svg
                        className="w-12 h-10 border rounded border-gray-300"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    }
                  />
                  <Button
                    variant="bordered"
                    className="w-full border-gray-300"
                    type="button"
                    startContent={
                      <svg
                        className="w-12 h-10 border rounded border-gray-300"
                        fill="#1877F2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    }
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
