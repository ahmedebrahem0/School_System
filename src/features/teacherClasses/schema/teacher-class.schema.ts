import { z } from "zod";

export const teacherClassSchema = z.object({
  teacherId: z.number().min(1, "Teacher is required"),
  classId: z.number().min(1, "Class is required"),
});

export type TeacherClassSchema = z.infer<typeof teacherClassSchema>;
