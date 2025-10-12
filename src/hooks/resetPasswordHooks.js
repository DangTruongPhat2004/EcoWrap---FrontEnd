// src/hooks/resetPasswordHooks.js
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi, confirmResetApi } from "../services/authApi.reset";

// Làm sạch email để tránh ký tự ẩn/khoảng trắng khi copy/paste
const normalizeEmail = (s) =>
  s
    ?.normalize("NFKC")
    ?.replace(
      /[\u200B-\u200D\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,
      ""
    )
    ?.trim()
    ?.toLowerCase() ?? "";

/** @typedef {{ email: string }} ForgotPayload */
/** @typedef {{ email: string, otp: string, newPassword: string }} ConfirmPayload */

/**
 * Gửi yêu cầu OTP (Forgot Password)
 * @param {import('@tanstack/react-query').UseMutationOptions<any, unknown, ForgotPayload>} opts
 */
export function useForgotPassword(opts = {}) {
  return useMutation({
    mutationKey: ["forgotPassword"],
    retry: false, // OTP flow: không nên auto-retry
    mutationFn: ({ email }) =>
      forgotPasswordApi({ email: normalizeEmail(email) }),
    ...opts,
  });
}

/**
 * Xác nhận OTP + đặt mật khẩu mới
 * @param {import('@tanstack/react-query').UseMutationOptions<any, unknown, ConfirmPayload>} opts
 */
export function useConfirmReset(opts = {}) {
  return useMutation({
    mutationKey: ["confirmReset"],
    retry: false,
    mutationFn: ({ email, otp, newPassword }) =>
      confirmResetApi({ email: normalizeEmail(email), otp, newPassword }),
    ...opts,
  });
}
