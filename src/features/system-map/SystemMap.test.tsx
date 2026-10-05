import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SystemMap } from "./SystemMap";

const session = vi.hoisted(() => ({ user: null as { role: string } | null }));
vi.mock("@/components/providers/AuthProvider", () => ({
  useAuth: () => ({ user: session.user, isLoading: false }),
}));

function mockMotion(reduced = false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("school system journey", () => {
  it("keeps workspace links scoped to the signed-in role when exploring other roles", () => {
    session.user = { role: "Student" };
    render(<SystemMap />);
    fireEvent.click(screen.getByRole("button", { name: "Admin" }));
    expect(screen.queryByRole("link", { name: "Open your workspace" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Teacher" }));
    expect(screen.queryByRole("link", { name: "Open your workspace" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Student" }));
    expect(screen.getByRole("link", { name: "Open your workspace" })).toHaveAttribute("href", "/student/my-profile");
  });

  beforeEach(() => {
    session.user = null;
    mockMotion();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("lets visitors explore a role without granting a signed-in workspace", () => {
    render(<SystemMap />);
    fireEvent.click(screen.getByRole("button", { name: "Teacher" }));
    const inspector = screen.getByRole("complementary", {
      name: "Selected stage details",
    });
    expect(
      within(inspector).getByRole("heading", {
        name: "Learning leaves a trace",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Enter EduSystem" }),
    ).toHaveAttribute("href", "/login");
    expect(
      screen.queryByRole("link", { name: "Your dashboard" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /open.*workspace/i }),
    ).not.toBeInTheDocument();
  });

  it("switches the complete guide to Arabic with RTL reading direction", () => {
    const { container } = render(<SystemMap />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to Arabic" }));
    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");
    expect(container.firstElementChild).toHaveAttribute("lang", "ar");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "مدرسة واحدة",
    );
    expect(screen.getByRole("button", { name: "المدرس" })).toBeInTheDocument();
  });

  it("pauses narration and cancels playback when a visitor explores a role", () => {
    vi.useFakeTimers();
    render(<SystemMap />);
    fireEvent.click(screen.getByRole("button", { name: "Play story" }));
    act(() => {
      vi.advanceTimersByTime(8500);
    });
    expect(
      screen.getByText("Give that community a rhythm."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Pause story" }));
    act(() => {
      vi.advanceTimersByTime(17000);
    });
    expect(
      screen.getByText("Give that community a rhythm."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Play story" }));
    fireEvent.click(screen.getByRole("button", { name: "Student" }));
    act(() => {
      vi.advanceTimersByTime(17000);
    });
    expect(
      screen.getByText("Three people. One shared journey."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Progress becomes personal" }),
    ).toBeInTheDocument();
  });

  it("finishes the seven-step story and can restart without a stale timer", () => {
    vi.useFakeTimers();
    render(<SystemMap />);
    fireEvent.click(screen.getByRole("button", { name: "Play story" }));
    for (let step = 0; step < 7; step++)
      act(() => {
        vi.advanceTimersByTime(8500);
      });
    expect(screen.getByText("Journey complete")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next story step" }),
    ).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Restart story" }));
    expect(
      screen.getByText("First, a class becomes a community."),
    ).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(17000);
    });
    expect(
      screen.getByText("First, a class becomes a community."),
    ).toBeInTheDocument();
  });

  it("starts in manual story mode for reduced-motion visitors", () => {
    mockMotion(true);
    vi.useFakeTimers();
    render(<SystemMap />);
    fireEvent.click(screen.getByRole("button", { name: /Watch a day unfold/ }));
    act(() => {
      vi.advanceTimersByTime(17000);
    });
    expect(
      screen.getByText("First, a class becomes a community."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play story" }),
    ).toBeInTheDocument();
  });
});
