import { z } from "zod";

export const gradeSchema = z.object({
  studentId: z
    .number({ error: "Student is required" })
    .int("Student is required")
    .positive("Student is required"),
  subjectId: z
    .number({ error: "Subject is required" })
    .int("Subject is required")
    .positive("Subject is required"),
  grade: z
    .number({ error: "Grade is required" })
    .min(0, "Grade cannot be less than 0")
    .max(100, "Grade cannot be more than 100"),
});

export type GradeSchema = z.infer<typeof gradeSchema>;
