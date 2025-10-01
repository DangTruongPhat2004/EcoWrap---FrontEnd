import { useMutation } from "@tanstack/react-query";
import { login, getUserById } from "../services/auth.service";
import { getUserIdFromToken } from "../utils/jwt";
import { useAuthStore } from "../store/authStore";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async ({ username, password }) => {
      const token = await login({ username, password });
      setToken(token);

      const id = getUserIdFromToken(token);
      if (!id) throw new Error("Không tìm thấy ID trong token.");

      const user = await getUserById(id);
      setUser(user);
      return { token, user };
    },
  });
}
