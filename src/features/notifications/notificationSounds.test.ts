import { describe, expect, it, vi } from "vitest";
import { createDeduplicatedNotificationPlayer } from "./notificationSounds";

describe("notification sound delivery", () => {
  it("plays once for duplicate realtime notification IDs", () => {
    const play = vi.fn();
    const handle = createDeduplicatedNotificationPlayer(play);

    handle({ id: "notification-1" });
    handle({ id: "notification-1" });
    handle({ id: "notification-2" });

    expect(play).toHaveBeenCalledTimes(2);
  });
});
