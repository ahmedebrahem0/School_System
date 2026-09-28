import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notificationFixture } from "@/test/mocks/fixtures/notifications";
import { NotificationBell } from "./NotificationBell";

const markRead = vi.fn();
const markAllRead = vi.fn();
const deleteNotification = vi.fn();
const retry = vi.fn();

vi.mock("../hooks/useNotifications", () => ({
  useNotifications: () => ({
    notifications: [notificationFixture],
    unreadCount: 1,
    totalCount: 1,
    isLoading: false,
    isError: false,
    isMarkingRead: false,
    isMarkingAllRead: false,
    isDeleting: false,
    markRead,
    markAllRead,
    deleteNotification,
    retry,
  }),
}));

describe("NotificationBell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows unread count and uses explicit read actions", async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    expect(screen.getByLabelText("1 unread notifications")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Notifications" }));

    expect(screen.getByText("Grade added")).toBeInTheDocument();
    expect(screen.getByText("A grade was added.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mark all read" }));
    expect(markAllRead).toHaveBeenCalledOnce();

    await user.click(
      screen.getByRole("button", { name: "Mark Grade added as read" })
    );
    expect(markRead).toHaveBeenCalledWith(notificationFixture);
  });

  it("deletes an item using its dedicated action", async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    await user.click(screen.getByRole("button", { name: "Delete Grade added" }));

    expect(deleteNotification).toHaveBeenCalledWith(notificationFixture);
  });
});
