import { describe, expect, it } from "vitest";
import { notificationFixture } from "@/test/mocks/fixtures/notifications";
import {
  admitNextNotification,
  createNotificationQueueState,
  dismissNotification,
  enqueueNotifications,
  reconcileNotificationCapacity,
} from "./notificationQueue";

const second = { ...notificationFixture, id: "second", title: "Second" };

describe("notificationQueue", () => {
  it("queues unread notifications once per session", () => {
    const initial = enqueueNotifications(createNotificationQueueState(), [
      notificationFixture,
      { ...second, isRead: true },
    ]);
    const repeated = enqueueNotifications(initial, [notificationFixture]);

    expect(repeated.pending).toEqual([notificationFixture]);
    expect(repeated.seenIds.has(notificationFixture.id)).toBe(true);
  });

  it("admits in order up to the visible limit", () => {
    let state = enqueueNotifications(createNotificationQueueState(), [
      notificationFixture,
      second,
    ]);
    state = admitNextNotification(state, 1);
    state = admitNextNotification(state, 1);

    expect(state.visible.map((item) => item.id)).toEqual([notificationFixture.id]);
    expect(state.pending.map((item) => item.id)).toEqual([second.id]);
  });

  it("dismisses visually without changing the notification read state", () => {
    let state = enqueueNotifications(createNotificationQueueState(), [notificationFixture]);
    state = admitNextNotification(state, 3);
    state = dismissNotification(state, notificationFixture.id);

    expect(state.visible).toHaveLength(0);
    expect(notificationFixture.isRead).toBe(false);
  });

  it("returns overflow cards to the front of the queue when capacity shrinks", () => {
    const third = { ...notificationFixture, id: "third", title: "Third" };
    let state = enqueueNotifications(createNotificationQueueState(), [
      notificationFixture,
      second,
      third,
    ]);
    state = admitNextNotification(state, 3);
    state = admitNextNotification(state, 3);
    state = admitNextNotification(state, 3);
    state = reconcileNotificationCapacity(state, 1);

    expect(state.visible.map((item) => item.id)).toEqual([notificationFixture.id]);
    expect(state.pending.map((item) => item.id)).toEqual([second.id, third.id]);
    expect(state.seenIds.size).toBe(3);
  });
});
