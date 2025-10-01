// store/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || "",
  user: null,
  setToken: (t) => {
    localStorage.setItem("token", t || "");
    set({ token: t || "" });
  },
  setUser: (u) => set({ user: u }),
  clear: () => {
    localStorage.removeItem("token");
    set({ token: "", user: null });
  },
  isAuthenticated: () => !!get().token && !!get().user,
}));
