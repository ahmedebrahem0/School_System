// features/students/schema/student.schema.ts

// Zod validation schema for StudentForm
// Used with react-hook-form zodResolver
// Validates both create and update operations

import { z } from "zod";

export const studentSchema = z.object({
  // ─────────────────────────────────────────────────────
  // NAME — Required, min 3 chars, max 100
  // ─────────────────────────────────────────────────────
  name: z
    .string()
    .min(1, "Student name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(), // Remove leading/trailing whitespace

  // ─────────────────────────────────────────────────────
  // DATE OF BIRTH — Optional, must be valid date
  // ─────────────────────────────────────────────────────
  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If empty string or undefined — it's optional, so OK
        if (!val || val === "") return true;

        // Must be a valid ISO date format (YYYY-MM-DD)
        const date = new Date(val);
        if (isNaN(date.getTime())) return false;

        // Must not be in the future
        if (date > new Date()) return false;

        // Must be realistic — not before 1900
        if (date.getFullYear() < 1900) return false;

        return true;
      },
      { message: "Please enter a valid date of birth (not in future, after 1900)" }
    ),

  // ─────────────────────────────────────────────────────
  // CLASS ID — Optional, must be positive number
  // ─────────────────────────────────────────────────────
  classId: z
    .number()
    .int("Class ID must be a whole number")
    .positive("Class ID must be a positive number")
    .optional(),
});

// Type inferred from schema
// Used as form data type throughout StudentForm
export type StudentSchema = z.infer<typeof studentSchema>;