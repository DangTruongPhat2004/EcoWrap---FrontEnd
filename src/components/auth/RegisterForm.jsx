// src/components/auth/RegisterForm.jsx
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
import logoImg from "../../assets/logo.png";
import { registerPayloadSchema } from "../../validation/schemas"; // bạn đã có file này

const inputStyles = {
  inputWrapper:
    "border border-gray-200 rounded-xl bg-white shadow-sm " +
    "data-[hover=true]:border-emerald-300 data-[hover=true]:shadow-md " +
    "group-data-[focus=true]:border-emerald-500 group-data-[focus=true]:shadow-lg " +
    "ring-0 focus:ring-0 data-[focus=true]:ring-0 " +
    "focus-visible:ring-2 focus-visible:ring-emerald-100 focus-visible:border-emerald-500 " +
    "transition-all duration-200 h-12",
  input:
    "text-[15px] placeholder:text-gray-400 px-4 " +
    "outline-none focus:outline-none focus-visible:outline-none appearance-none",
};

export default function RegisterForm({
  submitting = false,
  onSubmit, // (formData) => void
  secondarySlot, // chèn thêm nút/tooltip nếu muốn
}) {
  const [form, setForm] = React.useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
    password: "",
    remember: false,
  });
  const [touched, setTouched] = React.useState({
    lastName: false,
    firstName: false,
    phone: false,
    email: false,
    password: false,
  });
  const [errors, setErrors] = React.useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);

  // ---- validate bằng Zod schema bạn đã có ----
  const validate = React.useCallback((values) => {
    const z = registerPayloadSchema.safeParse(values);
    if (z.success)
      return {
        lastName: "",
        firstName: "",
        phone: "",
        email: "",
        password: "",
      };
    const e = {
      lastName: "",
      firstName: "",
      phone: "",
      email: "",
      password: "",
    };
    for (const issue of z.error.issues) {
      const key = issue.path?.[0];
      if (key && e[key] === "") e[key] = issue.message;
    }
    return e;
  }, []);

  const onChange = (field) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) setErrors((prev) => ({ ...prev, ...validate(next) }));
  };

  const onBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      lastName: true,
      firstName: true,
      phone: true,
      email: true,
      password: true,
    });
    const v = validate(form);
    setErrors(v);
    const hasError = Object.values(v).some(Boolean);
    if (hasError) return;
    onSubmit?.(form);
  };

  const isFormValid =
    !Object.values(validate(form)).some(Boolean) && !submitting;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]">
      <div className="flex items-center justify-center min-h-full py-8 px-4">
        <div className="max-w-[420px] w-full">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardBody className="p-8">
              {/* Header / Logo */}
              <div className="text-center mb-8">
                <div className="w-[100px] h-[80px] rounded-xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
                  <img
                    src={logoImg}
                    alt="EcoWrap Logo"
                    className="max-w-[160px] max-h-[80px] object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  Tạo tài khoản
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Tham gia cộng đồng{" "}
                  <strong className="text-emerald-600 font-semibold">
                    EcoWrap
                  </strong>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Họ và Tên cùng hàng */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Họ
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Nhập họ của bạn"
                      variant="bordered"
                      color="success"
                      value={form.lastName}
                      onChange={onChange("lastName")}
                      onBlur={onBlur("lastName")}
                      isInvalid={touched.lastName && !!errors.lastName}
                      errorMessage={touched.lastName ? errors.lastName : ""}
                      classNames={inputStyles}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Tên
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Nhập tên của bạn"
                      variant="bordered"
                      color="success"
                      value={form.firstName}
                      onChange={onChange("firstName")}
                      onBlur={onBlur("firstName")}
                      isInvalid={touched.firstName && !!errors.firstName}
                      errorMessage={touched.firstName ? errors.firstName : ""}
                      classNames={inputStyles}
                      required
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Số điện thoại
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    variant="bordered"
                    color="success"
                    value={form.phone}
                    onChange={onChange("phone")}
                    onBlur={onBlur("phone")}
                    isInvalid={touched.phone && !!errors.phone}
                    errorMessage={touched.phone ? errors.phone : ""}
                    classNames={inputStyles}
                    autoComplete="tel"
                    inputMode="tel"
                    startContent={
                      <span className="text-gray-400 text-sm">+84</span>
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    variant="bordered"
                    color="success"
                    value={form.email}
                    onChange={onChange("email")}
                    onBlur={onBlur("email")}
                    isInvalid={touched.email && !!errors.email}
                    errorMessage={touched.email ? errors.email : ""}
                    classNames={inputStyles}
                    autoComplete="email"
                    autoCapitalize="off"
                    autoCorrect="off"
                    startContent={
                      <svg
                        className="w-4 h-4 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 7L10.94 11.94C11.59 12.37 12.41 12.37 13.06 11.94L20 7M4 7V17C4 17.55 4.45 18 5 18H19C19.55 18 20 17.55 20 17V7M4 7C4 6.45 4.45 6 5 6H19C19.55 6 20 6.45 20 7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                    required
                  />
                </div>

                {/* Mật khẩu */}
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Mật khẩu
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tạo mật khẩu mạnh"
                    variant="bordered"
                    color="success"
                    value={form.password}
                    onChange={onChange("password")}
                    onBlur={onBlur("password")}
                    isInvalid={touched.password && !!errors.password}
                    errorMessage={touched.password ? errors.password : ""}
                    classNames={inputStyles}
                    autoComplete="new-password"
                    startContent={
                      <svg
                        className="w-4 h-4 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M16 10V8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8V10M6 10H18C19.1 10 20 10.9 20 12V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                        className="outline-none p-1 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {showPassword ? (
                          <svg
                            className="w-4 h-4 text-gray-500"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M3 3L21 21M10.58 10.58C10.22 10.94 10 11.44 10 12C10 13.1 10.9 14 12 14C12.56 14 13.06 13.78 13.42 13.42M9.88 5.08C10.56 4.72 11.26 4.5 12 4.5C16.25 4.5 19.5 7.75 19.5 12C19.5 12.74 19.28 13.44 18.92 14.12M6.53 6.53C4.26 7.69 2.52 9.6 1.5 12C2.52 14.4 4.26 16.31 6.53 17.47"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-500"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M1.5 12S4.5 5.5 12 5.5S22.5 12 22.5 12S19.5 18.5 12 18.5S1.5 12 1.5 12Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                        )}
                      </button>
                    }
                    required
                  />
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              form.password.length >= i * 2
                                ? "bg-emerald-500"
                                : "bg-gray-200"
                            } transition-colors`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {form.password.length < 6
                          ? "Tối thiểu 6 ký tự"
                          : "Mật khẩu mạnh"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Remember + Quên MK */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer select-none">
                    <Checkbox
                      name="remember"
                      isSelected={form.remember}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, remember: v }))
                      }
                      color="success"
                      size="sm"
                      classNames={{
                        base: "m-0 p-0",
                        wrapper:
                          "after:bg-emerald-500 after:text-white border-gray-300",
                        icon: "text-white",
                      }}
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>

                  <Link
                    href="#"
                    color="success"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full font-semibold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 h-12"
                  isLoading={submitting}
                  disabled={!isFormValid}
                  radius="lg"
                >
                  {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </Button>

                {/* Đã có tài khoản */}
                <div className="text-center pt-2">
                  <p className="text-[#6B7280] text-sm">
                    Đã có tài khoản?{" "}
                    <Link
                      href="/login"
                      className=" text-green-600 hover:text-emerald-700 transition-colors"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>

                {secondarySlot /* tuỳ chọn */}
              </form>

              {/* Social */}
              <div className="mt-8">
                <div className="relative flex items-center justify-center">
                  <Divider className="flex-1 bg-gray-200" />
                  <span className="px-4 text-sm text-[#6B7280] bg-white font-medium">
                    Hoặc tiếp tục với
                  </span>
                  <Divider className="flex-1 bg-gray-200" />
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    variant="bordered"
                    className="w-full h-12 justify-center border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    radius="lg"
                    startContent={
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  >
                    <span className="text-gray-700 font-medium">
                      Đăng ký bằng Google
                    </span>
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
