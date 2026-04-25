// features/auth/hooks/useLogin.ts

// Login hook — handles authentication flow
// Sends credentials to Next.js Route Handler
// Route Handler stores token in HttpOnly Cookie
// Then updates AuthContext with user data

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import type { LoginFormData, LoginHandlerResponse } from "../types";

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

      // Handle error response from Route Handler
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Invalid credentials");
        return;
      }

      // Extract user data from response
      // Token is already stored in HttpOnly Cookie by Route Handler
      const { user }: LoginHandlerResponse = await response.json();

      // Update AuthContext with user data
      // This triggers re-render in Sidebar, Header, etc.
      setUser(user);

      // Redirect to callbackUrl if exists
      // Otherwise redirect to dashboard
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || ROUTES.DASHBOARD);
      router.refresh();

      toast.success(`Welcome back, ${user.fullName}!`);

    } catch {
      // Network error or Route Handler is down
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};