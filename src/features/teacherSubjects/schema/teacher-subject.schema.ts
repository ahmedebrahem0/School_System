import { z } from "zod";

export const teacherSubjectSchema = z.object({
  teacherId: z.number().min(1, "Teacher is required"),
  subjectId: z.number().min(1, "Subject is required"),
});

export type TeacherSubjectSchema = z.infer<typeof teacherSubjectSchema>;
