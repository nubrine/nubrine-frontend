import { create } from "zustand";
import { API_BASE } from "../lib/api";
import { cacheUser, getCachedUser, clearCachedUser } from "../lib/db";
import { devtools } from 'zustand/middleware'
import { CachedUser } from "../lib/offline";


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
          await cacheUser(user); 
        } else {
          console.log("res.ok failed in authStore initialize, status:", res.status);
          set({ status: "unauthenticated", user: null });
        }
      } catch (error) {
        console.log("Error in authStore");
        // this time we will load from cached uses
        const cachedUser = await getCachedUser();
        if (cachedUser) {
          console.log("Loaded user from cache in authStore:", cachedUser);
          set({ status: "authenticated", user: cachedUser });
        } else {
          set({ status: "unauthenticated", user: null });
        }
      }
    },
    clearAuth: ()=>{
      set({status: "unauthenticated", user: null})
    },
  }), { name: 'AuthStore' })
);