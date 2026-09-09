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
import type { AuthUser } from "@/types/api.types";
import type { LoginFormData } from "../types";

interface UseLoginReturn {
  login: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

type LoginRouteResponse =
  | {
      status: "pending";
      message: string;
      token: string;
    }
  | {
      user: AuthUser;
      token: string;
    };

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Invalid credentials. Please try again.");
        return;
      }

      const result: LoginRouteResponse = await response.json();
      window.localStorage.setItem("token", result.token);

      if ("status" in result) {
        toast.warning("Your account is pending role assignment.");
        router.push("/pending");
        return;
      }

      setUser(result.user);

      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || ROUTES.DASHBOARD);
      router.refresh();

      toast.success(`Welcome back, ${result.user.fullName}!`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
