import { describe, expect, it } from "vitest";
import { notificationFixture } from "@/test/mocks/fixtures/notifications";
import { getNotificationHref } from "./notificationRoutes";
import type { NotificationItem } from "./types";

const notification = notificationFixture as NotificationItem;

describe("getNotificationHref", () => {
  it("routes staff and students to role-safe grade pages", () => {
    expect(getNotificationHref(notification, "Admin")).toBe("/grades/15");
    expect(getNotificationHref(notification, "Student")).toBe(
      "/student/my-grades"
    );
  });

  it("falls back safely for unknown entities", () => {
    expect(
      getNotificationHref(
        { ...notification, relatedEntityType: "UnknownEntity" },
        "Teacher"
      )
    ).toBeNull();
  });

  it("routes pending-role notifications only for admins", () => {
    const pending = {
      ...notification,
      type: "UserPendingRole",
      relatedEntityType: "ApplicationUser",
    } satisfies NotificationItem;

    expect(getNotificationHref(pending, "Admin")).toBe("/admin/users");
    expect(getNotificationHref(pending, "Teacher")).toBeNull();
  });
});
