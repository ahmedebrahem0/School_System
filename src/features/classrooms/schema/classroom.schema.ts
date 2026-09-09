import { z } from "zod";

export const classroomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

export type ClassroomSchema = z.infer<typeof classroomSchema>;
