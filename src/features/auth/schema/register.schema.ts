// features/auth/schema/register.schema.ts

// Zod validation schema for the register form
// Used with react-hook-form zodResolver

import { z } from "zod";

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .regex(/^\S+$/, "Username cannot contain spaces"),

    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters"),

    gender: z.enum(["Male", "Female"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),
//     gender: z.enum(["Male", "Female"], {
//   required_error: "Please select a gender",
//   invalid_type_error: "Please select a gender",
// }),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })

  // Cross-field validation
  // Checks that password and confirmPassword match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error appears on confirmPassword field
  });

// Type inferred from schema
// Used as the form data type in RegisterForm
export type RegisterSchema = z.infer<typeof registerSchema>;