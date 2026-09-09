// features/teachers/schema/teacher.schema.ts

import { z } from "zod";

export const teacherSchema = z.object({
  name: z
    .string()
    .min(1, "Teacher name is required")
    .min(3, "Teacher name must be at least 3 characters")
    .max(50, "Teacher name must be less than 50 characters")
    .trim(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;
