import { z } from "zod";
import { ALL_ATTENDANCE_STATUSES } from "@/constants/attendance-status";

export const attendanceSchema = z.object({
  studentId: z
    .number({ error: "Student is required" })
    .int("Student is required")
    .positive("Student is required"),
  date: z
    .string({ error: "Date is required" })
    .min(1, "Date is required"),
  status: z.enum(ALL_ATTENDANCE_STATUSES, {
    error: "Attendance status is required",
  }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;
