import { describe, expect, it } from "vitest";
import {
  notificationFixture,
  notificationPageFixture,
} from "@/test/mocks/fixtures/notifications";

describe("notifications API contract", () => {
  it("matches the documented inbox item shape", () => {
    expect(notificationFixture).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      message: expect.any(String),
      type: "GradeAdded",
      priority: "Normal",
      createdAtUtc: expect.stringMatching(/Z$/),
      isRead: false,
    });
    expect(notificationFixture.expiresAtUtc).toBeNull();
    expect(notificationFixture.readAtUtc).toBeNull();
  });

  it("matches the documented pagination shape", () => {
    expect(notificationPageFixture).toEqual({
      items: [notificationFixture],
      page: 1,
      pageSize: 20,
      totalCount: 1,
      totalPages: 1,
      hasNext: false,
    });
  });

  it("mocks the inbox and unread-count endpoints", async () => {
    const [inboxResponse, countResponse] = await Promise.all([
      fetch("http://localhost/api/backend/api/Notifications?Page=1&PageSize=20"),
      fetch("http://localhost/api/backend/api/Notifications/unread-count"),
    ]);

    expect(inboxResponse.status).toBe(200);
    expect(await inboxResponse.json()).toEqual(notificationPageFixture);
    expect(countResponse.status).toBe(200);
    expect(await countResponse.json()).toEqual({ count: 1 });
  });
});
