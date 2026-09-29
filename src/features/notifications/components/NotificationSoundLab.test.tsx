import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { playNotificationSound } from "../notificationSounds";
import { NotificationSoundLab } from "./NotificationSoundLab";

const stopFirst = vi.fn();
const stopSecond = vi.fn();

vi.mock("../notificationSounds", async (importOriginal) => {
  const original = await importOriginal<typeof import("../notificationSounds")>();
  return {
    ...original,
    playNotificationSound: vi.fn(),
    unlockNotificationAudio: vi.fn().mockResolvedValue(true),
    isNotificationAudioUnlocked: vi.fn().mockReturnValue(true),
  };
});

describe("NotificationSoundLab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(playNotificationSound)
      .mockReset()
      .mockReturnValueOnce({ stop: stopFirst })
      .mockReturnValueOnce({ stop: stopSecond });
  });

  it("previews the selected sound at the chosen master volume", async () => {
    const user = userEvent.setup();
    render(<NotificationSoundLab />);

    await user.click(screen.getByRole("button", { name: "Preview Soft Double Chime" }));

    expect(playNotificationSound).toHaveBeenCalledWith("soft-chime", 0.65);
    expect(localStorage.getItem("notification-sound-id")).toBe("soft-chime");
    expect(screen.getByRole("button", { name: "Preview Soft Double Chime" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("stops an active preview before playing another sound", async () => {
    const user = userEvent.setup();
    render(<NotificationSoundLab />);

    await user.click(screen.getByRole("button", { name: "Preview Soft Double Chime" }));
    await user.click(screen.getByRole("button", { name: "Preview Gentle Bell" }));

    expect(stopFirst).toHaveBeenCalledOnce();
    expect(playNotificationSound).toHaveBeenLastCalledWith("gentle-bell", 0.65);
  });

  it("uses an updated volume for the next preview", async () => {
    const user = userEvent.setup();
    render(<NotificationSoundLab />);

    fireEvent.change(screen.getByRole("slider", { name: "Master volume" }), {
      target: { value: "40" },
    });
    await user.click(screen.getByRole("button", { name: "Preview Minimal Pop" }));

    expect(playNotificationSound).toHaveBeenCalledWith("minimal-pop", 0.4);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });
});
