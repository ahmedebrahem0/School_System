import { z } from "zod";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const timetableSchema = z.object({
  classId: z.number().min(1, "Class is required"),
  subjectId: z.number().min(1, "Subject is required"),
  dayOfWeek: z.enum(DAYS_OF_WEEK as [string, ...string[]], {
    error: "Invalid day of week",
  }),
  timeSlotId: z.number().min(1, "Time slot is required"),
  classroomId: z.number().min(1, "Classroom is required"),
});

export type TimetableSchema = z.infer<typeof timetableSchema>;
