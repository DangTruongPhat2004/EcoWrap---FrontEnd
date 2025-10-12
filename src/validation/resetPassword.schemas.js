// src/validation/resetPassword.schemas.js
import { z } from "zod";

/** ==== Cấu hình dùng chung (UI & schema) ==== */
export const PASSWORD_MIN = 8; // đổi thành 6 nếu muốn
export const OTP_LENGTH = 6;

export const OTP_REGEX = new RegExp(`^\\d{${OTP_LENGTH}}$`);

// Nếu muốn bắt buộc thêm ký tự đặc biệt thì dùng regex dưới (mặc định: chữ + số + đặc biệt)
// export const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// Nếu chỉ cần chữ + số (không bắt buộc ký tự đặc biệt) thì dùng regex này:
export const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

/** ==== Schemas ==== */
export const schemaEmail = z.object({
  email: z.string().min(3, "Email quá ngắn").email("Email không hợp lệ"),
});

/**
 * Validate toàn bộ tại cấp object để:
 * - Bắn lỗi "newPassword" cho các rule: min length, pattern
 * - Bắn lỗi "confirm" khi không khớp
 * - Bắn lỗi "otp" theo độ dài
 */
export const schemaConfirm = z
  .object({
    otp: z.string().regex(OTP_REGEX, `Mã OTP phải gồm ${OTP_LENGTH} chữ số`),
    newPassword: z.string().min(1, "Vui lòng nhập mật khẩu mới"),
    confirm: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .superRefine((data, ctx) => {
    const { newPassword, confirm } = data;

    // 1) Độ dài
    if ((newPassword || "").length < PASSWORD_MIN) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: PASSWORD_MIN,
        type: "string",
        inclusive: true,
        path: ["newPassword"],
        message: `Tối thiểu ${PASSWORD_MIN} ký tự`,
      });
    }

    // 2) Pattern (chữ + số) — hoặc thay thành regex có ký tự đặc biệt ở trên
    if (!PW_REGEX.test(newPassword || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: PW_REGEX.toString().includes("[^A-Za-z0-9]")
          ? "Mật khẩu phải có chữ cái, số và ký tự đặc biệt"
          : "Mật khẩu phải có cả chữ và số",
      });
    }

    // 3) Khớp confirm
    if (confirm !== newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm"],
        message: "Mật khẩu không khớp",
      });
    }
  });

/** ==== Default values dùng cho form ==== */
export const defaultResetValues = {
  email: "",
  otp: "",
  newPassword: "",
  confirm: "",
};
