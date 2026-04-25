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
      toast.success("Account created successfully! Please login.");
      router.push(ROUTES.AUTH.LOGIN);

    } catch (error: unknown) {
      // RTK Query error shape
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Registration failed. Please try again.");
    }
  };

  return { register, isLoading };
};