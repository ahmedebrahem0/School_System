// features/students/schema/student.schema.ts

// Zod validation schema for the student form
// Used with react-hook-form zodResolver
// Covers both create and update operations

import { z } from "zod";

export const studentSchema = z.object({
  name: z
    .string()
    .min(1, "Student name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),

  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If empty string or undefined — it's ok (optional)
        if (!val || val === "") return true;

        // Must be a valid date
        const date = new Date(val);
        if (isNaN(date.getTime())) return false;

        // Must not be in the future
        if (date > new Date()) return false;

        // Must be realistic — not before 1900
        if (date.getFullYear() < 1900) return false;

        return true;
      },
      { message: "Please enter a valid date of birth" }
    ),

  classId: z
    .number()
    .int("Class ID must be a whole number")
    .positive("Class ID must be a positive number")
    .optional(),
});

// Type inferred from schema
// Used as form data type in StudentForm
export type StudentSchema = z.infer<typeof studentSchema>;