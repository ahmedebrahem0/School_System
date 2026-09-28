import { describe, expect, it } from "vitest";
import { sendNotificationSchema } from "./sendNotification.schema";

const valid = {
  title: "Exam tomorrow",
  message: "Math exam starts at 09:00.",
  type: "Announcement" as const,
  priority: "High" as const,
  targetType: "Class" as const,
  targetId: "3",
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
});
