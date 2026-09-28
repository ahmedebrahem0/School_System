import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SendNotificationForm } from "./SendNotificationForm";

const send = vi.fn();
const unwrap = vi.fn();

vi.mock("@/components/providers/AuthProvider", () => ({
  useAuth: () => ({ user: { role: "Admin" } }),
}));
vi.mock("@/features/admin/api", () => ({
  useGetAdminUsersQuery: () => ({ data: [] }),
}));
vi.mock("@/features/classes/api", () => ({
  useGetClassesQuery: () => ({ data: [] }),
}));
vi.mock("@/features/subjects/api", () => ({
  useGetSubjectsQuery: () => ({ data: [] }),
}));
vi.mock("@/features/teachers/api", () => ({
  useGetMyTeacherClassesQuery: () => ({ data: [] }),
  useGetMyTeacherSubjectsQuery: () => ({ data: [] }),
}));
vi.mock("../api", () => ({
  useSendNotificationMutation: () => [send, { isLoading: false }],
  useCancelScheduledNotificationMutation: () => [vi.fn(), { isLoading: false }],
}));

describe("SendNotificationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    send.mockImplementation(() => ({ unwrap }));
  });

  it("reuses its idempotency key when the same operation is retried", async () => {
    unwrap
      .mockRejectedValueOnce({ data: { message: "Temporary failure" } })
      .mockResolvedValueOnce({
        notificationId: "22222222-2222-2222-2222-222222222222",
        recipientCount: 4,
        wasDuplicate: false,
      });
    const user = userEvent.setup();
    render(<SendNotificationForm />);

    await user.type(screen.getByLabelText("Title"), "Exam tomorrow");
    await user.type(
      screen.getByLabelText("Message"),
      "Math exam starts at 09:00."
    );
    await user.click(screen.getByLabelText("Target"));
    await user.click(screen.getByRole("option", { name: "Student" }));

    await user.click(screen.getByRole("button", { name: "Send notification" }));
    await waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    await user.click(screen.getByRole("button", { name: "Send notification" }));
    await waitFor(() => expect(send).toHaveBeenCalledTimes(2));

    expect(send.mock.calls[0][0].idempotencyKey).toBeTruthy();
    expect(send.mock.calls[1][0].idempotencyKey).toBe(
      send.mock.calls[0][0].idempotencyKey
    );
  }, 10_000);
});
