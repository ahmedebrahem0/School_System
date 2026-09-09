import { z } from "zod";

export const classSubjectSchema = z.object({
  classId: z.number().min(1, "Class is required"),
  subjectId: z.number().min(1, "Subject is required"),
});

export type ClassSubjectSchema = z.infer<typeof classSubjectSchema>;
