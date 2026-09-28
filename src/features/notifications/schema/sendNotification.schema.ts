import { z } from "zod";
import {
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_TARGET_TYPES,
  NOTIFICATION_TYPES,
} from "../types";

export const sendNotificationSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(150),
    message: z.string().trim().min(1, "Message is required").max(1000),
    type: z.enum(NOTIFICATION_TYPES),
    priority: z.enum(NOTIFICATION_PRIORITIES),
    targetType: z.enum(NOTIFICATION_TARGET_TYPES),
    targetId: z.string().trim().optional(),
    deliveryMode: z.enum(["Immediate", "Scheduled"]),
    scheduledAtLocal: z.string().optional(),
    expiresAtLocal: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.targetType !== "All" && !data.targetId) {
      context.addIssue({
        code: "custom",
        path: ["targetId"],
        message: "Target is required",
      });
    }

    if (data.targetType === "All" && data.targetId) {
      context.addIssue({
        code: "custom",
        path: ["targetId"],
        message: "All notifications must not include a target ID",
      });
    }
    const now = Date.now();
    const scheduled = data.scheduledAtLocal ? new Date(data.scheduledAtLocal).getTime() : NaN;
    const expires = data.expiresAtLocal ? new Date(data.expiresAtLocal).getTime() : NaN;
    if (data.deliveryMode === "Scheduled" && (!data.scheduledAtLocal || scheduled <= now)) {
      context.addIssue({ code: "custom", path: ["scheduledAtLocal"], message: "Choose a future schedule time" });
    }
    if (data.expiresAtLocal && expires <= now) {
      context.addIssue({ code: "custom", path: ["expiresAtLocal"], message: "Expiry must be in the future" });
    }
    if (data.deliveryMode === "Scheduled" && data.expiresAtLocal && scheduled > expires) {
      context.addIssue({ code: "custom", path: ["expiresAtLocal"], message: "Expiry must be after the schedule time" });
    }
  });

export type SendNotificationFormData = z.infer<typeof sendNotificationSchema>;
