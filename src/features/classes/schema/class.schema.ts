// features/classes/schema/class.schema.ts

import { z } from "zod";

export const classSchema = z.object({
  className: z
    .string()
    .min(1, "Class name is required")
    .min(3, "Class name must be at least 3 characters")
    .max(50, "Class name must be less than 50 characters")
    .trim(),
});

export type ClassSchema = z.infer<typeof classSchema>;