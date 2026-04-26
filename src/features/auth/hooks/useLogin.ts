// features/auth/hooks/useLogin.ts

// Login hook — handles the complete authentication flow
// Sends credentials to Next.js Route Handler (not directly to backend)
// Route Handler stores token in HttpOnly Cookie
// Handles two cases: normal login and pending role

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import type { LoginFormData } from "../types";

interface UseLoginReturn {
  login: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);

    try {
      // Send credentials to Next.js Route Handler
      // Route Handler will call backend and set HttpOnly Cookie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // ─────────────────────────────────────────────
      // HANDLE ERROR RESPONSE
      // Wrong credentials or server error
      // ─────────────────────────────────────────────
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Invalid credentials. Please try again.");
        return;
      }

      const result = await response.json();

      // ─────────────────────────────────────────────
      // CASE 1: Role is Pending
      // User is authenticated but has no role yet
      // Redirect to pending page
      // ─────────────────────────────────────────────
      if (result.status === "pending") {
        toast.warning("Your account is pending role assignment.");
        router.push("/pending");
        return;
      }

      // ─────────────────────────────────────────────
      // CASE 2: Normal login — role is assigned
      // Update AuthContext with user data
      // Redirect to dashboard or callbackUrl
      // ─────────────────────────────────────────────
      setUser(result.user);

      // Redirect to callbackUrl if exists
      // Example: user tried to visit /students while logged out
      // After login → redirect back to /students
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || ROUTES.DASHBOARD);

      // Refresh server components so middleware sees new cookie
      router.refresh();

      toast.success(`Welcome back, ${result.user.fullName}!`);

    } catch {
      // Network error or Route Handler is down
      toast.error("Something went wrong. Please try again.");

    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};