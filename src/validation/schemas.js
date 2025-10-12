// src/validation/schemas.js
import { z } from "zod";
import { normalizeEmail, normalizePhoneVN } from "../utils/normalize"; // hoặc "../utils/normalize"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_VN_RE = /^(0|\+84)\d{9}$/;

// Dùng chung cho mọi nơi nhập email
export const emailSchema = z
  .string({ required_error: "Vui lòng nhập email" })
  .transform(normalizeEmail)
  .refine((v) => v.length > 0, { message: "Vui lòng nhập email" })
  .refine((v) => EMAIL_RE.test(v), { message: "Email không hợp lệ" });

export const phoneVNSchema = z
  .string({ required_error: "Vui lòng nhập số điện thoại" })
  .transform(normalizePhoneVN)
  .refine((v) => PHONE_VN_RE.test(v), {
    message: "Số điện thoại VN không hợp lệ",
  });

export const passwordMin6Schema = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự")
  .max(128, "Mật khẩu quá dài");
export const nameSchema = z.string().min(1, "Bắt buộc").max(100, "Quá dài");

// Register (giữ nguyên nếu bạn đang dùng)
export const registerPayloadSchema = z.object({
  lastName: nameSchema,
  firstName: nameSchema,
  phone: phoneVNSchema,
  email: emailSchema,
  password: passwordMin6Schema,
});
export const toBackendRegister = (f) => ({
  username:
    f.email.split("@")[0].replace(/[^a-zA-Z0-9._-]/g, "") ||
    `${f.lastName}.${f.firstName}`.toLowerCase(),
  password: f.password,
  email: f.email, // đã normalize
  fullName: `${f.lastName} ${f.firstName}`.replace(/\s+/g, " ").trim(),
  phoneNumber: normalizePhoneVN(f.phone),
});

// Forgot Password (Step 1)
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Confirm Reset (Step 2) — KHÔNG cần email ở bước này
export const confirmResetSchema = z
  .object({
    otp: z
      .string({ required_error: "Nhập mã OTP" })
      .regex(/^\d{4,8}$/, "Mã OTP gồm 4–8 chữ số"),
    newPassword: z
      .string({ required_error: "Vui lòng nhập mật khẩu mới" })
      .min(8, "Tối thiểu 8 ký tự")
      .max(128, "Mật khẩu quá dài")
      .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, "Phải chứa chữ và số"),
    confirmPassword: z.string({ required_error: "Xác nhận lại mật khẩu" }),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu không khớp",
  });
