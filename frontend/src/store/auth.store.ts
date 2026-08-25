import { create } from "zustand";

import { getMe } from "../sdk/auth.api";
import type { MeResponse } from "../sdk/types";

type AuthState = {
  user: MeResponse | null;
  isLoading: boolean;
  isLoggedIn: boolean;

  fetchMe: () => Promise<void>;
  setUser: (user: MeResponse) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isLoggedIn: false,

  fetchMe: async () => {
    try {
      set({ isLoading: true });

      const user = await getMe();

      set({
        user,
        isLoggedIn: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
      });
    }
  },

  setUser: (user) => {
    set({
      user,
      isLoggedIn: true,
      isLoading: false,
    });
  },

  clearUser: () => {
    set({
      user: null,
      isLoggedIn: false,
      isLoading: false,
    });
  },
}));
