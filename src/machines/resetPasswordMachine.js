// src/machines/resetPasswordMachine.js
// XState v5 — Reset Password flow (EMAIL -> SEND -> VERIFY -> SUBMIT -> SUCCESS)
// BE endpoints (Swagger bạn cung cấp):
// 1) POST /api/ForgotPassword/request   { email }
// 2) POST /api/ForgotPassword/confirm   { email, otp, newPassword }

import { createMachine } from "xstate";

/**
 * Context:
 *  - email: string
 *  - error: string | null
 *
 * States:
 *  - email         : nhập email
 *  - sendingEmail  : đang gọi API gửi OTP
 *  - verify        : nhập OTP + mật khẩu mới
 *  - submitting    : đang xác nhận/đổi mật khẩu
 *  - success       : hoàn tất
 *
 * Events:
 *  - SUBMIT_EMAIL   { email }
 *  - EMAIL_OK
 *  - EMAIL_FAIL     { message }
 *  - SUBMIT_RESET   { otp, newPassword }
 *  - RESET_OK
 *  - RESET_FAIL     { message }
 *  - BACK
 *  - RESTART
 */

export const resetPasswordMachine = createMachine({
  id: "resetPassword",
  context: {
    email: "",
    error: null,
  },
  initial: "email",
  states: {
    // Bước 1: nhập email
    email: {
      on: {
        SUBMIT_EMAIL: {
          target: "sendingEmail",
          actions: ({ context, event }) => {
            context.email = (event.email || "").trim().toLowerCase();
            context.error = null;
          },
        },
      },
    },

    // Gọi API gửi OTP
    sendingEmail: {
      on: {
        EMAIL_OK: { target: "verify" },
        EMAIL_FAIL: {
          target: "email",
          actions: ({ context, event }) => {
            context.error = event.message || "Gửi email thất bại";
          },
        },
        BACK: { target: "email" },
      },
    },

    // Bước 2: nhập OTP + mật khẩu mới
    verify: {
      on: {
        SUBMIT_RESET: { target: "submitting" },
        BACK: { target: "email" },
      },
    },

    // Gọi API confirm (email, otp, newPassword)
    submitting: {
      on: {
        RESET_OK: { target: "success" },
        RESET_FAIL: {
          target: "verify",
          actions: ({ context, event }) => {
            context.error =
              event.message || "Xác nhận mã/đổi mật khẩu thất bại";
          },
        },
      },
    },

    // Hoàn tất
    success: {
      on: {
        RESTART: {
          target: "email",
          actions: ({ context }) => {
            context.email = "";
            context.error = null;
          },
        },
      },
    },
  },
});

export default resetPasswordMachine;
