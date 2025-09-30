import { useMutation } from "@tanstack/react-query";
import { registerAccount, verifyEmail } from "../services/auth.service";
import { mapApiError } from "../utils/errorMapper";

export function useRegisterInit() {
  return useMutation({
    mutationFn: registerAccount,
    onError: (err) => {
      throw mapApiError(err);
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
    onError: (err) => {
      throw mapApiError(err);
    },
  });
}

/**
 * RESEND OTP tạm thời: re-init bằng payload đăng ký ban đầu
 * @param {{ email: string, ... }} payload
 */
export function useResendOtp() {
  return useMutation({
    mutationFn: async (payload) => {
      // payload nên giống hệt form đăng ký lúc init
      return await registerAccount(payload);
    },
    onError: (err) => {
      throw mapApiError(err);
    },
  });
}
