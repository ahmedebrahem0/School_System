import { http, HttpResponse } from "msw";
import {
  notificationPageFixture,
  unreadCountFixture,
} from "@/test/mocks/fixtures/notifications";

export const handlers = [
  http.get("*/api/backend/api/Notifications", ({ request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get("Page") !== "1") {
      return HttpResponse.json({ message: "Invalid Page" }, { status: 400 });
    }

    return HttpResponse.json(notificationPageFixture);
  }),
  http.get("*/api/backend/api/Notifications/unread-count", () =>
    HttpResponse.json(unreadCountFixture)
  ),
];
