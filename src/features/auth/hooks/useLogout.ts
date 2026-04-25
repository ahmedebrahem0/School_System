// features/auth/hooks/useLogout.ts

// Logout hook — handles the complete logout flow
// Clears RTK Query cache, auth context, and cookies
// Provides a simple interface for components

import { useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppDispatch } from "@/store/hooks";
import { baseApi } from "@/store/baseApi";

interface UseLogoutReturn {
  logout: () => Promise<void>;
}

export const useLogout = (): UseLogoutReturn => {
  const { logout: authLogout } = useAuth();
  const dispatch = useAppDispatch();

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear all RTK Query cached data
      // Prevents previous user data from showing to next user
      dispatch(baseApi.util.resetApiState());

      // Call AuthContext logout
      // → Calls /api/auth/logout Route Handler
      // → Clears HttpOnly Cookie
      // → Clears user from Context
      // → Redirects to login
      await authLogout();

      toast.success("Logged out successfully");

    } catch {
      toast.error("Something went wrong during logout");
    }
  }, [authLogout, dispatch]);

  return { logout };
};