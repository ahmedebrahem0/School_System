import { describe, expect, it, vi } from "vitest";
import type { AppDispatch } from "@/store";
import { registerNotificationHandlers, type NotificationConnection } from "./realtime";

function fakeConnection() {
  const handlers = new Map<string, (...args: never[]) => void>();
  let reconnected = () => undefined;
  const connection: NotificationConnection = {
    start: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
    on: (name, handler) => handlers.set(name, handler),
    onreconnected: (handler) => { reconnected = handler; },
  };
  return { connection, handlers, reconnect: () => reconnected() };
}

describe("notification realtime handlers", () => {
  it("registers events and refreshes REST state after events and reconnect", () => {
    const dispatch = vi.fn() as unknown as AppDispatch;
    const fake = fakeConnection();
    registerNotificationHandlers(fake.connection, dispatch);

    expect([...fake.handlers.keys()]).toEqual(["NotificationCreated", "UnreadCountChanged"]);
    fake.handlers.get("NotificationCreated")!();
    fake.handlers.get("UnreadCountChanged")!({ count: 4 } as never);
    fake.reconnect();
    expect(dispatch).toHaveBeenCalledTimes(3);
  });
});
