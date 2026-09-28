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
  });

export type SendNotificationFormData = z.infer<typeof sendNotificationSchema>;
