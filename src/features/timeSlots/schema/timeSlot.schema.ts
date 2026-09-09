import { z } from "zod";

export const timeSlotSchema = z
  .object({
    startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time format (HH:MM or HH:MM:SS)"),
    endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time format (HH:MM or HH:MM:SS)"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type TimeSlotSchema = z.infer<typeof timeSlotSchema>;
