// validation/schemas.js
import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Email không hợp lệ")
  .transform((s) => s.trim().toLowerCase());

export const phoneVNSchema = z
  // Không dùng /g !!!
  .string()
  .regex(/^(0|\+84)\d{9}$/, "Số điện thoại VN không hợp lệ");

export const passwordMin6Schema = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự");
export const nameSchema = z.string().min(1, "Bắt buộc").max(100, "Quá dài");

export const registerPayloadSchema = z.object({
  lastName: nameSchema,
  firstName: nameSchema,
  phone: phoneVNSchema,
  email: emailSchema,
  password: passwordMin6Schema,
});

// map form -> payload BE
export const toBackendRegister = (f) => ({
  username:
    f.email.split("@")[0].replace(/[^a-zA-Z0-9._-]/g, "") ||
    `${f.lastName}.${f.firstName}`.toLowerCase(),
  password: f.password,
  email: f.email,
  fullName: `${f.lastName} ${f.firstName}`.replace(/\s+/g, " ").trim(),
  phoneNumber: f.phone.replace(/\s|-/g, ""),
});
