import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it } from "vitest";
import { baseApi } from "@/store/baseApi";
import { notificationPageFixture } from "@/test/mocks/fixtures/notifications";
import { server } from "@/test/mocks/server";
import { notificationsApi } from "./api";

function createTestStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
}

describe("notificationsApi", () => {
  const stores: ReturnType<typeof createTestStore>[] = [];

  afterEach(() => {
    stores.forEach((store) => store.dispatch(baseApi.util.resetApiState()));
    stores.length = 0;
  });

  it("maps inbox filters to backend query parameters", async () => {
    let capturedUrl = "";
    server.use(
      http.get("*/api/backend/api/Notifications", ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json(notificationPageFixture);
      })
    );
    const store = createTestStore();
    stores.push(store);

    await store
      .dispatch(
        notificationsApi.endpoints.getNotifications.initiate({
          page: 2,
          pageSize: 10,
          isRead: false,
          type: "GradeAdded",
          priority: "High",
        })
      )
      .unwrap();

    const url = new URL(capturedUrl);
    expect(url.searchParams.get("Page")).toBe("2");
    expect(url.searchParams.get("PageSize")).toBe("10");
    expect(url.searchParams.get("IsRead")).toBe("false");
    expect(url.searchParams.get("Type")).toBe("GradeAdded");
    expect(url.searchParams.get("Priority")).toBe("High");
  });

  it("rolls back optimistic read updates when backend fails", async () => {
    server.use(
      http.patch("*/api/backend/api/Notifications/:id/read", () =>
        HttpResponse.json({ message: "Failed" }, { status: 500 })
      )
    );
    const store = createTestStore();
    stores.push(store);
    const queryArgs = { page: 1, pageSize: 20 };

    await Promise.all([
      store
        .dispatch(notificationsApi.endpoints.getNotifications.initiate(queryArgs))
        .unwrap(),
      store
        .dispatch(
          notificationsApi.endpoints.getUnreadNotificationCount.initiate()
        )
        .unwrap(),
    ]);

    await expect(
      store
        .dispatch(
          notificationsApi.endpoints.markNotificationRead.initiate({
            id: notificationPageFixture.items[0].id,
          })
        )
        .unwrap()
    ).rejects.toBeDefined();

    const inbox = notificationsApi.endpoints.getNotifications.select(queryArgs)(
      store.getState()
    );
    const count = notificationsApi.endpoints.getUnreadNotificationCount.select()(
      store.getState()
    );
    expect(inbox.data?.items[0].isRead).toBe(false);
    expect(count.data?.count).toBe(1);
  });

  it("sends one stable idempotency key with the payload", async () => {
    let capturedKey: string | null = null;
    let capturedBody: unknown;
    server.use(
      http.post("*/api/backend/api/Notifications/send", async ({ request }) => {
        capturedKey = request.headers.get("Idempotency-Key");
        capturedBody = await request.json();
        return HttpResponse.json(
          {
            notificationId: "22222222-2222-2222-2222-222222222222",
            recipientCount: 3,
            wasDuplicate: false,
          },
          { status: 201 }
        );
      })
    );
    const store = createTestStore();
    stores.push(store);
    const data = {
      title: "Exam tomorrow",
      message: "Math exam starts at 09:00.",
      type: "Announcement" as const,
      priority: "High" as const,
      targetType: "Class" as const,
      targetId: "3",
    };

    const response = await store
      .dispatch(
        notificationsApi.endpoints.sendNotification.initiate({
          data,
          idempotencyKey: "operation-key-1",
        })
      )
      .unwrap();

    expect(capturedKey).toBe("operation-key-1");
    expect(capturedBody).toEqual(data);
    expect(response.recipientCount).toBe(3);
  });
});
