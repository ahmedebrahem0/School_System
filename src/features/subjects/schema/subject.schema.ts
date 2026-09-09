// features/subjects/schema/subject.schema.ts

import { z } from "zod";

export const subjectSchema = z.object({
  subjectName: z
    .string()
    .min(1, "Subject name is required")
    .min(3, "Subject name must be at least 3 characters")
    .max(50, "Subject name must be less than 50 characters")
    .trim(),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;