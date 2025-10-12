import React from "react";
import { useMachine } from "@xstate/react";
import { resetPasswordMachine } from "../../machines/resetPasswordMachine";
import { OTP_LENGTH } from "../../validation/resetPassword.schemas.js";
// ❌ Bỏ import z từ "zod" (đã chuyển qua file schema)
// import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Input,
  Button,
  Chip,
  Tooltip,
  Progress,
} from "@nextui-org/react";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  RefreshCcw,
  Check,
} from "lucide-react";
import {
  forgotPasswordRequest,
  confirmResetPassword,
} from "../../services/authApi.reset";

// ✅ Dùng schemas tách riêng
import {
  schemaEmail,
  schemaConfirm,
  defaultResetValues,
  PASSWORD_MIN,
  PW_REGEX,
} from "../../validation/resetPassword.schemas";

// ------------ Helpers ------------
function maskEmail(e) {
  if (!e) return "";
  const [name, domain] = e.split("@");
  const head = name?.slice(0, 2) ?? "";
  return `${head}${"*".repeat(Math.max(0, (name?.length || 0) - 2))}@${
    domain ?? ""
  }`;
}
function passwordScore(pw = "") {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 5);
}

export default function ResetPasswordWizard() {
  const [state, send] = useMachine(resetPasswordMachine);
  const step = state.value; // "email" | "sendingEmail" | "verify" | "submitting" | "success"
  const { email, error } = state.context;

  const emailForm = useForm({
    resolver: zodResolver(schemaEmail),
    defaultValues: { email: defaultResetValues.email },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const confirmForm = useForm({
    resolver: zodResolver(schemaConfirm),
    defaultValues: { otp: "", newPassword: "", confirm: "" },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    criteriaMode: "all",
  });

  const [showPw, setShowPw] = React.useState(false);
  const newPw = confirmForm.watch("newPassword");
  const pwScore = passwordScore(newPw);
  const pwPercent = (pwScore / 5) * 100;

  const values = confirmForm.getValues();
  const fieldErrors = confirmForm.formState.errors;

  const canSubmit =
    values.otp?.length === OTP_LENGTH &&
    values.newPassword?.length > 0 &&
    values.confirm?.length > 0 &&
    !fieldErrors.otp &&
    !fieldErrors.newPassword &&
    !fieldErrors.confirm;

  // ------------ Handlers ------------
  const onSubmitEmail = async ({ email }) => {
    send({ type: "SUBMIT_EMAIL", email });
    try {
      await forgotPasswordRequest(email);
      // clear lỗi field nếu có trước đó
      emailForm.clearErrors();
      send({ type: "EMAIL_OK" });
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Không gửi được OTP";
      // ví dụ backend trả "Email not found"
      if (String(msg).toLowerCase().includes("email")) {
        emailForm.setError("email", { type: "server", message: msg });
      } else {
        // fallback để vẫn thấy lỗi
        emailForm.setError("email", {
          type: "server",
          message: "Không gửi được OTP",
        });
      }
      send({ type: "EMAIL_FAIL", message: msg });
    }
  };

  const onSubmitConfirm = async ({ otp, newPassword }) => {
    send({ type: "SUBMIT_RESET" });
    try {
      await confirmResetPassword({ email, otp, newPassword });
      confirmForm.clearErrors();
      send({ type: "RESET_OK" });
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Xác nhận thất bại";

      // Heuristic: map lỗi dựa theo thông điệp server
      const lower = String(msg).toLowerCase();
      if (lower.includes("otp")) {
        confirmForm.setError("otp", {
          type: "server",
          message: "OTP không đúng hoặc đã hết hạn",
        });
      } else if (lower.includes("password") || lower.includes("mật khẩu")) {
        confirmForm.setError("newPassword", {
          type: "server",
          message: "Mật khẩu không hợp lệ",
        });
      } else {
        // gắn OTP là field thường gây lỗi nhất nếu không xác định
        confirmForm.setError("otp", { type: "server", message: msg });
      }

      send({ type: "RESET_FAIL", message: msg });
    }
  };

  // ------------ UI bits ------------
  const StepChip = ({ active, done, children }) => (
    <Chip
      size="sm"
      startContent={done ? <Check size={14} /> : <ShieldCheck size={14} />}
      color={active ? "primary" : done ? "success" : "default"}
      variant={active || done ? "solid" : "flat"}
      className="rounded-full"
    >
      {children}
    </Chip>
  );

  const inputWrapper =
    "h-12 rounded-xl border border-gray-200 bg-white " +
    "data-[hover=true]:border-emerald-300 data-[hover=true]:shadow-sm " +
    "group-data-[focus=true]:border-emerald-500 group-data-[focus=true]:shadow-md " +
    "transition-all";

  const labelHidden = "sr-only";

  return (
    <div className="max-w-lg mx-auto mt-10 px-4 py-6">
      <Card className="border border-gray-200 shadow-md overflow-hidden">
        <CardHeader className="flex flex-col items-start gap-3 !py-6 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck size={18} />
            <p className="text-sm">
              Bảo vệ tài khoản bằng cách đặt lại mật khẩu an toàn.
            </p>
          </div>
        </CardHeader>
        <CardBody className="space-y-7">
          {/* STEP 1: EMAIL */}
          {(step === "email" || step === "sendingEmail") && (
            <form
              onSubmit={emailForm.handleSubmit(onSubmitEmail)}
              className="space-y-5"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Quên mật khẩu</h2>
                <p className="text-sm text-gray-600">
                  Nhập email để nhận mã OTP đặt lại mật khẩu.
                </p>
              </div>

              <Controller
                name="email"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Input
                    classNames={{
                      label: labelHidden,
                      inputWrapper: inputWrapper,
                      input: "text-[15px]",
                    }}
                    startContent={
                      <Mail size={16} className="text-gray-500 m-2" />
                    }
                    placeholder="Nhập email đã đăng ký"
                    type="email"
                    aria-label="Email"
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    autoFocus
                  />
                )}
              />
              <p className="text-xs text-gray-500">
                Mẹo: dùng email đã đăng ký tài khoản trước đó.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end">
                {step === "sendingEmail" ? (
                  <Button isLoading color="primary" className="min-w-[140px]">
                    Đang gửi OTP…
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    color="primary"
                    endContent={<ArrowRight size={16} />}
                    className="min-w-[140px] bg-emerald-500 hover:bg-emerald-600"
                  >
                    Gửi OTP
                  </Button>
                )}
              </div>
            </form>
          )}
          {/* STEP 2: OTP + NEW PASSWORD */}
          {(step === "verify" || step === "submitting") && (
            <form
              onSubmit={confirmForm.handleSubmit(onSubmitConfirm)}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold">
                  Nhập OTP & đặt mật khẩu mới
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">OTP đã gửi tới:</span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
                    {maskEmail(email)}
                  </span>
                </div>
              </div>

              {/* OTP */}
              <Controller
                name="otp"
                control={confirmForm.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      classNames={{
                        label: labelHidden,
                        inputWrapper: inputWrapper,
                        input: "tracking-widest placeholder:text-sm",
                      }}
                      startContent={
                        <KeyRound size={16} className="text-gray-500 m-2" />
                      }
                      placeholder="Nhập mã OTP"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={field.value ?? ""}
                      onValueChange={(v) => {
                        const only = (v || "").replace(/\D/g, "");
                        confirmForm.clearErrors("otp");
                        field.onChange(only);
                        confirmForm.trigger("otp");
                      }}
                      onBlur={field.onBlur}
                      isInvalid={!!fieldState.error}
                      // có thể giữ lại, nhưng ta sẽ chắc chắn show bên dưới
                      errorMessage={fieldState.error?.message}
                      maxLength={6}
                    />
                    {confirmForm.formState?.errors?.otp?.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {confirmForm.formState.errors.otp.message}
                      </p>
                    )}
                  </>
                )}
              />
              <p className="text-xs text-gray-500">
                Không thấy mail? Kiểm tra hộp thư rác/Spam.
              </p>

              {/* New Password */}
              <Controller
                name="newPassword"
                control={confirmForm.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      classNames={{
                        label: labelHidden,
                        inputWrapper: inputWrapper,
                        input: "placeholder:text-sm",
                      }}
                      startContent={
                        <Lock size={16} className="text-gray-500 m-2" />
                      }
                      placeholder={`Mật khẩu mới (tối thiểu ${PASSWORD_MIN} ký tự)`}
                      type={showPw ? "text" : "password"}
                      value={field.value ?? ""}
                      onValueChange={(v) => {
                        const val = v ?? ""; // raw input
                        confirmForm.clearErrors(["newPassword", "confirm"]); // ✨
                        field.onChange(val);
                        confirmForm.trigger(["newPassword", "confirm"]); // validate chéo ngay
                      }}
                      onBlur={field.onBlur}
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      autoComplete="new-password"
                      endContent={
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => setShowPw((s) => !s)}
                          aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      }
                    />
                    {confirmForm.formState?.errors?.newPassword?.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {confirmForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </>
                )}
              />

              {/* Confirm */}
              <Controller
                name="confirm"
                control={confirmForm.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      classNames={{
                        label: labelHidden,
                        inputWrapper: inputWrapper,
                        input: "placeholder:text-sm",
                      }}
                      startContent={
                        <Lock size={16} className="text-gray-500 m-2" />
                      }
                      placeholder="Nhập lại mật khẩu mới"
                      type={showPw ? "text" : "password"}
                      value={field.value ?? ""}
                      onValueChange={(v) => {
                        const val = v ?? "";
                        confirmForm.clearErrors(["confirm", "newPassword"]); // ✨
                        field.onChange(val);
                        confirmForm.trigger(["confirm", "newPassword"]);
                      }}
                      onBlur={field.onBlur}
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      autoComplete="new-password"
                      endContent={
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => setShowPw((s) => !s)}
                          aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      }
                    />
                    {confirmForm.formState?.errors?.confirm?.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {confirmForm.formState.errors.confirm.message}
                      </p>
                    )}
                  </>
                )}
              />
              {/* Password strength */}
              <div className="space-y-2">
                <Progress
                  aria-label="password-strength"
                  value={pwPercent}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Độ mạnh mật khẩu</span>
                  <span className="font-medium text-emerald-700">
                    {pwScore <= 2
                      ? "Yếu"
                      : pwScore === 3
                      ? "Trung bình"
                      : "Mạnh"}
                  </span>
                </div>
                <ul className="text-xs text-gray-500 list-disc pl-4">
                  <li>Kết hợp chữ hoa, số và ký tự đặc biệt sẽ mạnh hơn.</li>
                </ul>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="flat"
                  startContent={<ArrowLeft size={16} />}
                  onPress={() => {
                    confirmForm.reset(defaultResetValues); // clear fields
                    confirmForm.clearErrors();
                    send({ type: "BACK" });
                  }}
                >
                  Nhập email khác
                </Button>

                {step === "submitting" ? (
                  <Button isLoading color="primary" className="min-w-[160px]">
                    Đang xác nhận…
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    color="primary"
                    endContent={<CheckCircle size={16} />}
                    className="min-w-[160px]"
                    isDisabled={
                      !canSubmit || confirmForm.formState.isSubmitting
                    }
                  >
                    Đổi mật khẩu
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <div className="text-center py-10">
              <CheckCircle
                className="mx-auto mb-3 text-emerald-600"
                size={40}
              />
              <h3 className="text-lg font-semibold mb-1">
                Đặt lại mật khẩu thành công
              </h3>
              <p className="text-gray-600 mb-5">
                Bạn có thể đăng nhập bằng mật khẩu mới.
              </p>
              <div className="flex justify-center gap-2">
                {/* <Button
                  color="default"
                  variant="flat"
                  startContent={<ArrowLeft size={16} />}
                  onPress={() => send({ type: "RESTART" })}
                >
                  Làm lại
                </Button> */}
                <Button
                  as={"a"}
                  href="/login"
                  color="primary"
                  endContent={<ArrowRight size={16} />}
                >
                  Đi đến đăng nhập
                </Button>
              </div>
            </div>
          )}
        </CardBody>

        <Divider />

        <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-gray-500">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <a href="/terms" className="underline">
              Điều khoản
            </a>{" "}
            &{" "}
            <a href="/privacy" className="underline">
              Chính sách bảo mật
            </a>
            .
          </div>
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} EcoWrap
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
