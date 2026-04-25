// features/auth/schema/login.schema.ts

// Zod validation schema for the login form
// Used with react-hook-form zodResolver

import { z } from "zod";

export const loginSchema = z.object({
  userNameOrEmail: z
    .string()
    .min(1, "Username or email is required")
    .min(3, "Must be at least 3 characters"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Type inferred from schema
// Used as the form data type in LoginForm
export type LoginSchema = z.infer<typeof loginSchema>;