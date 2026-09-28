import { describe, expect, it } from "vitest";
import { sendNotificationSchema } from "./sendNotification.schema";

const valid = {
  title: "Exam tomorrow",
  message: "Math exam starts at 09:00.",
  type: "Announcement" as const,
  priority: "High" as const,
  targetType: "Class" as const,
  targetId: "3",
  deliveryMode: "Immediate" as const,
  scheduledAtLocal: "",
  expiresAtLocal: "",
};

describe("sendNotificationSchema", () => {
  it("requires a target ID except for All", () => {
    expect(
      sendNotificationSchema.safeParse({ ...valid, targetId: "" }).success
    ).toBe(false);
    expect(
      sendNotificationSchema.safeParse({
        ...valid,
        targetType: "All",
        targetId: "",
      }).success
    ).toBe(true);
  });

  it("enforces backend title and message limits", () => {
    expect(
      sendNotificationSchema.safeParse({ ...valid, title: "x".repeat(151) })
        .success
    ).toBe(false);
    expect(
      sendNotificationSchema.safeParse({ ...valid, message: "x".repeat(1001) })
        .success
    ).toBe(false);
  });

  it("requires future schedule and expiry times in the correct order", () => {
    const localInput = (date: Date) => {
      const pad = (value: number) => String(value).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };
    const future = localInput(new Date(Date.now() + 60 * 60 * 1000));
    const later = localInput(new Date(Date.now() + 2 * 60 * 60 * 1000));
    const past = localInput(new Date(Date.now() - 60 * 60 * 1000));

    expect(sendNotificationSchema.safeParse({ ...valid, deliveryMode: "Scheduled", scheduledAtLocal: past }).success).toBe(false);
    expect(sendNotificationSchema.safeParse({ ...valid, expiresAtLocal: past }).success).toBe(false);
    expect(sendNotificationSchema.safeParse({ ...valid, deliveryMode: "Scheduled", scheduledAtLocal: later, expiresAtLocal: future }).success).toBe(false);
    expect(sendNotificationSchema.safeParse({ ...valid, deliveryMode: "Scheduled", scheduledAtLocal: future, expiresAtLocal: later }).success).toBe(true);
  });
});
