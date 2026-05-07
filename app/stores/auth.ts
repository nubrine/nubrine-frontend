import { create } from "zustand";
import { API_BASE } from "../lib/api";
import { CachedUser } from "../lib/offline";
import { devtools } from 'zustand/middleware'


type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthState {
  status: AuthStatus;
  user: CachedUser | null;
  initialize: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    status: "checking",
    user: null,
    initialize: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v0/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const user: CachedUser = await res.json();
          set({ status: "authenticated", user });
          //await cacheUser(user);
        } else {
          set({ status: "unauthenticated", user: null });
        }
      } catch (error) {
        console.log("Error in authStore");
        set({ status: "unauthenticated", user: null });
      }
    },
    clearAuth: ()=>{
      set({status: "unauthenticated", user: null})
    },
  }), { name: 'AuthStore' })
);