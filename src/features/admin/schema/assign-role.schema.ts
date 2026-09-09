import { z } from "zod";
import { ALL_ROLES } from "@/constants/roles";

export const assignRoleSchema = z.object({
  userId: z.string().min(1, "User is required"),
  role: z.enum(ALL_ROLES, {
    error: "Role is required",
  }),
});

export type AssignRoleSchema = z.infer<typeof assignRoleSchema>;
