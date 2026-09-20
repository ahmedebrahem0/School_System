// features/auth/hooks/useRegister.ts

// Register hook — handles user registration
// Uses RTK Query to send data directly to backend
// On success redirects to login page

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegisterMutation } from "../api";
import { ROUTES } from "@/constants/routes";
import type { RegisterFormData } from "../types";

interface UseRegisterReturn {
  register: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

export const useRegister = (): UseRegisterReturn => {
  const router = useRouter();

  // RTK Query mutation hook
  // useRegisterMutation → auto-generated from authApi
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const register = async (data: RegisterFormData): Promise<void> => {
    // Remove confirmPassword before sending to backend
    // Backend doesn't expect this field
    const { confirmPassword: _, ...registerDto } = data;

    try {
      // Send registration data to backend via RTK Query
      await registerMutation(registerDto).unwrap();

      // Success → redirect to login
      // Account has no role yet — an admin must assign one before the
      // user can access the dashboard (they'll land on /pending on login).
      toast.success(
        "Account created! An admin needs to assign your role before you can sign in.",
        { duration: 6000 }
      );
      router.push(ROUTES.AUTH.LOGIN);

    } catch (error: unknown) {
      // Backend replies in plain text, so the error payload is a string,
      // not a JSON object — e.g. "Username is already taken."
      const err = error as { data?: unknown };
      const message =
        typeof err.data === "string" ? err.data : "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return { register, isLoading };
};
